import bcrypt from 'bcrypt'
import handleError from '../libs/handleError';
import User from '../models/user.model';
import { generateAndSendPasswordResetOTP, sendVerificationEmail } from '../libs/mail';
import generateToken from '../libs/generateToken';
import { IUser } from '../types/user';
import { CustomRequestHandler } from '../types/request';
import { AuthenticatedRequest } from '../types/request';
import ResetOTP from '../models/resetOTP.model';
import VerificationToken from '../models/verificationToken.model';
import crypto from 'crypto'
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken'

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password



// @desc Register a new User
// @route POST: /api/auth/signup
// @access Public
const signupUser: CustomRequestHandler = async (req, res, next) => {
    const { username, email, password } = req.body;

    try{
        // validating the data from the frontend
        if(username.length < 3){
            return next(handleError(403, "Username must be at least three letters long" ));
        }
        if(!email.length){
            return next(handleError(403, "Enter email" ));
        }
        if(!emailRegex.test(email)){
            return next(handleError(403, "Email is Invalid" ));
        }
        if(!passwordRegex.test(password)){
            return next(handleError(403, "Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters." ));
        }

        // check if the user already exists in the database
        const emailExists = await User.findOne({"personal_info.email":email});
        const usernameExists = await User.findOne({"personal_info.username": username});


        if(usernameExists){
            return next(handleError(403, "Username is already in use" ));
        }
        if(emailExists){
            return next(handleError(403, "Email is already in use"));
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new User
        const newUser = new User({
            personal_info:{
                username,
                email,
                fullname: '',
                password: hashedPassword
            }
        });

        // save the user
        await newUser.save();

        // Explicitly cast newUser to User
        const newUserAsUser: IUser = newUser.toObject() as IUser;

        // send verification link to the user
        // await sendVerificationEmail(newUser);
        await sendVerificationEmail(newUserAsUser);



        return res.status(200).json({
            success: true,
            status: 'verification pending',
            statusCode:200,
            message: `verification link sent to your email'`,
        })
    }catch(error:any){
        if(error.code === 11000){
            return next(handleError(500, "Username already Exists"));
        }
        return next(error);
    }
}

// @desc Login a User
// @route GET /api/auth/resendVerificationMail/:id
// @access Public
const resendVerificationEmail: CustomRequestHandler = async (req, res, next) => {
try {
    const { id: userId } = req.params;

    // check if user exists
    const user:IUser | null = await User.findById(userId);

    if(!user){
       return  next(handleError(403, 'User dosent exist'))
    }
    generateToken(res, userId);

    // Explicitly cast newUser to User
    // const userAsUser: IUser = user.toObject() as IUser;

    // await sendVerificationEmail(user);
    // await sendVerificationEmail(userAsUser);

    const emailSent =  await sendVerificationEmail(user);

    if(!emailSent){
         return next(handleError(403, `Error, couldn't send verification email, try again`));
     }

    const { personal_info: { username:userName, fullname, email:userEmail, profile_img: profileImg}, role, _id, verified} = user

    return res.status(200).json({
        success: true,
        status: 'verification pending',
        statusCode:200,
        message: `verification link sent to your email'`,
        user:{
            username: userName,
            email: userEmail,
            profileImg,
            userId:_id,
            role,
            verified,
            fullname
        },
    })

}catch(error){
    return next(error);
}
}


// @desc Login a User
// @route POST /api/auth/signup
// @access Public
const signinUser: CustomRequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    try{
        // Check if User has already registered
        const user:IUser | null = await User.findOne({"personal_info.email":email});
        if(!user){
            return next(handleError(400, "User not found" ));
        }


        // check if the user is not signed in with google
        if(!user.google_auth){

            const { verified } = user

            if(!verified){
                // Send verification email
               const emailSent =  await sendVerificationEmail(user);

               if(emailSent){
                    return next(handleError(403, "User not Verified, verification link sent to your email"));
                }else{
                    return  next(handleError(403, `User not Verified, couldn't send email, try again`));
                }
            }

            // comapare new password with encrypted password
            const validated = await bcrypt.compare(String(password), String(user.personal_info.password));


            // If passwords dont match
            if(!validated){
                return next(handleError(403, "Wrong Credentials" ));
            }

            // generate Access Token
            generateToken(res, user._id);

           const { personal_info: { username, fullname, email, profile_img:profileImg}, role, verified:isVerified } = user
            // const expiryTime = new Date(Date.now() + 360000) //1 hour
            return res.status(200).json({
                success: true,
                status: 'Success',
                message: `Successfully signed in`,
                user:{
                    username,
                    fullname,
                    email,
                    userId: user._id,
                    profileImg,
                    role,
                    verified:isVerified
                }
            })
        }else{
            return next(handleError(403, "Already registered using Google" ));
        }
    }catch(error){
        return next(error);
    }
}

// @desc Log a user out
// @route POST /api/auth/signout'
// @access Public
const signoutUser:CustomRequestHandler = async (req, res, next) => {
    try {
        res.clearCookie('jwt').status(200).json({message: 'Signed out successfully'})
    } catch (error) {
        return next(error);
    }
}


// @desc Generate OTP
// @route GET /api/auth/admin'
// @access Public
const adminRoute: CustomRequestHandler = async (req:AuthenticatedRequest, res, next) => {
    try {
        res.status(200).json({message: 'Access Granted, because you are an admin', user: req.user})
    } catch (error) {
        return next(error)
    }
}

// @desc a sample private route
// @route GET /api/auth/private'
// @access Private
const resetPassword: CustomRequestHandler = async (req:AuthenticatedRequest, res, next) => {
    try {
        // Check if req.user exists
        if (!req.user) {
            return next(handleError(403, 'User not found'));
        }

        const { _id } = req.user;
        const { newPassword } = req.body;
        const user = await User.findById(_id);

        if(!user){
           return next(handleError(403, 'User not found'))
        }

         // Check if personal_info exists
         if (!user.personal_info) {
            return next(handleError(403, 'Personal info not found'));
        }

        if(!newPassword){
            return next(handleError(403, 'Provide your new Password'))
        }

        // Update user's password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.personal_info.password = hashedPassword;
        await user.save();

        // Clear JWT cookie
        res.clearCookie('jwt');

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Password reset successfully.'
        })
    } catch (error) {
        return next(error)
    }
}


// @desc Generate OTP
// @route POST: /api/auth/generateOTP'
// @access Public
const generateOTP: CustomRequestHandler = async (req, res, next) => {
    const { email } = req.body
    try {
        if(!email){
            next(handleError(403, 'Please Provide your email'))
        }
        // Check if User has already registered
        const user = await User.findOne({"personal_info.email": email});

        if(!user){// user does not exist
          return  next(handleError(403, `Account doesn't exist`))
        }else{// user exists
            // generate and send new OTP to users email
            // Explicitly cast newUser to User
            const userAsUser: IUser = user.toObject() as IUser;
            await generateAndSendPasswordResetOTP(userAsUser);
            // await generateAndSendPasswordResetOTP(user);
        }
        return res.status(200).json({
            success: true,
            status:'SUCCESS',
            message:'Password reset OTP sent to user',
        })
    } catch (error) {
        return next(error);
    }
}


// @desc Verify OTP
// @route POST /api/auth/verifyOTP
// @access Public
const verifyOTP: CustomRequestHandler = async (req, res, next) => {
    try {
        const { email, OTP } = req.body

        // Check if user provided details
        if(!email || !OTP){
            return next(handleError(403, 'Empty OTP details are not allowed'));
        }

       // Find the user based on the userId
        const user = await User.findOne({"personal_info.email": email});

        // User doesn't exist
        if(!user){
            return next(handleError(403, `Account record doesn't exist, Please create Account`));
        }

        // If User exists in database, check for the userId in the ResetOTP collections
        const userVerificationRecords = await ResetOTP.findOne({owner: user._id});

        if(!userVerificationRecords){
            // no record found
            return next(handleError(403, `This OTP is already verified`));
        }else{
            // user OTP record exists
            const { expiresAt, OTP:savedOTP } = userVerificationRecords;
            if(expiresAt && expiresAt.getTime() < Date.now()){
                // User OTP record has expired, delete ResetOTP
                await ResetOTP.deleteMany({owner:user._id});
                return next(handleError(403, 'OTP has expired. Please request again.'))
            }else{
                // compare generated OTP to the hashed OTP in th database
                const validOTP = await bcrypt.compare(OTP, savedOTP);
                if(!validOTP){
                    // Supplied OTP is wrong
                    return next(handleError(403, 'Invalid code passed, check your inbox.'))
                }else{
                    // success valid OTP
                    await User.findOneAndUpdate({_id: user._id}, { verified: true});

                    //  delete the VerificationOTP
                    await ResetOTP.deleteMany({owner:user._id});

                    // Upon successful OTP verification, generate and store the JWT token in cookies
                    generateToken(res, user._id.toString());
                    // const {personal_info: {username,  profile_img}, role} = verifiedUser;
                    return res.status(200).json({
                        success: true,
                        statusCode: 200,
                        message: `OTP was successfully VERIFIED`,
                    })
                }
            }
        }
    } catch (error) {
        return next(error);
    }
}


// @desc Successfully redirecting user when OTP is valid
// @route GET /api/auth/resendOTP
// @access Public
const resendOTP: CustomRequestHandler = async (req, res, next) => {
    const { email } = req.body
    try {
        if(!email){
            next(handleError(403, 'Please Provide your email'))
        }
        // Check if User has already registered
        const user = await User.findOne({"personal_info.email": email});

        if(!user){// user does not exist
            return  next(handleError(403, `Account doesn't exist`))
          }else{// user exists
              // generate and send new OTP to users email
              // Explicitly cast newUser to User
              const userAsUser: IUser = user.toObject() as IUser;
              await generateAndSendPasswordResetOTP(userAsUser);
              // await generateAndSendPasswordResetOTP(user);
          }
          return res.status(200).json({
              success: true,
              status:'SUCCESS',
              message:'Password reset OTP sent to user',
          })

    } catch (error) {
        return next(error);
    }
}


// @desc Authenticate a User using Google
// @route POST /api/auth/google-auth'
// @access Public
const googleAuth: CustomRequestHandler = async (req, res, next) => {
    const { email, name, photo } = req.body;
    try {
        // Check if user already exists in the database
        let user = await User.findOne({"personal_info.email": email});

        if (user) {
            // Check if the existing user was not signed up with Google
            if (!user.google_auth) {
                next(handleError(403, "This email was signed up without Google. Please log in with password to access the account"));
            }else{
                // const {_id:userId, personal_info: {username, profile_img, fullname}, role } = user
                const userId = user?._id ?? '';
                const username = user?.personal_info?.username ?? '';
                const profileImg = user?.personal_info?.profile_img ?? '';
                const fullname = user?.personal_info?.fullname ?? '';
                const role = user?.role ?? '';
                const verified = user?.verified

                 // generate an access token
                generateToken(res, userId.toString());

                 // Respond with the user information
                return res.status(200).json({
                    success: true,

                    statusCode:200,
                    message: `Successfully Signed in'`,
                    user:{
                        username,
                        profileImg,
                        userId,
                        fullname,
                        role,
                        verified
                    },
                })
            }
        } else {
            // If user does not exist, create a new user with Google authentication
            const username = name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8);

            user = new User({
                personal_info: {
                    fullname: name,
                    username,
                    email,
                    profile_img: photo,
                    role: 'user',
                },
                google_auth: true,
                verified: true
            });

            // Save the new user to the database
            await user.save();
            const {_id:userId, role } = user;

            // generate an access token
            generateToken(res, userId.toString());

        // Respond with the user information
        return res.status(200).json({
            success: true,
            statusCode:200,
            message: `Successfully Signed Up'`,
            user:{
                username,
                profile_img:photo,
                userId,
                role,
            },
        })
        }
    } catch (error) {
        next(error);
    }
}

// @desc Authenticate a User using Google
// @route POST /api/auth/google-auth'
// @access Protected
const verifyUser: CustomRequestHandler = async (req, res, next) => {
    try {
        const { id: userId, token:userToken } = req.params;
        // const { token: userToken } = req.query;

        // check if user exists
        const user = await User.findById(userId);

        if(!user){
           return  next(handleError(403, 'Invalid link'))
        }

        const verificationToken = await VerificationToken.findOne({owner: userId });

        if(!verificationToken){
            return  next(handleError(403, 'Invalid Link'))
        }

        // user OTP record exists
        const { expiresAt, token:savedToken } = verificationToken;

        if(expiresAt && expiresAt.getTime() < Date.now()){
            return  next(handleError(403, 'verification link expired,  request for another link'))
        }

         // Compare the hashed token with the hash of the user-provided unhashed token
        const isValid = crypto.createHash('sha256').update(userToken).digest('hex') === savedToken;

        if(!isValid){
            return  next(handleError(403, 'Invalid verification token'))
        }

        await User.updateOne({_id: userId}, {verified:true});

        // Delete verification token from the database
        await VerificationToken.deleteOne({ owner: userId  });

        // const { personal_info: { username:user_username, profile_img}, role, _id, verified} = user

        const _id = user?._id ?? '';
        const username = user?.personal_info?.username ?? '';
        const fullname = user?.personal_info?.fullname ?? '';
        const email = user?.personal_info?.email ?? '';
        const profileImg = user?.personal_info?.profile_img ?? '';
        const verified = user?.verified ?? '';
        const role = user?.role ?? '';

        generateToken(res, _id.toString());

        return res.status(200).json({
            success: true,
            message: 'User successfully verified',
            userId,
            userData: {
                fullname,
                username,
                email,
                profileImg,
                verified,
                role,
                userId: _id
            },
         });
    } catch (error) {
        return next(error);
    }
}


const readCookies: CustomRequestHandler  = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(token === undefined){
            return next(handleError(401, 'cookie not found'));
        }
        // console.log("token now ------>>>", token)
        if(token){
            const decoded: string | JwtPayload  = jwt.verify(token, process.env.SECRET_ACCESS_KEY!);
            // Check if decoded is a string (invalid token)
            if (typeof decoded === 'string') {
                return next(handleError(401, 'Invalid token'));
            }
            // Get user from the token
            const user = await User.findById(decoded.userId).select('-personal_info.password');

            const fullname = user?.personal_info?.fullname;
            const username = user?.personal_info?.username;
            const email = user?.personal_info?.email;
            const profileImg = user?.personal_info?.profile_img;
            const verified = user?.verified
            const role = user?.role
            const userId = user?._id

            // run the next middleware
            return res.status(200).json({
                success: true,
                userData: {
                    fullname,
                    username,
                    email,
                    profileImg,
                    verified,
                    role,
                    userId
                }
            })
        }else{
            return next(handleError(401, 'token expired'));
        }
    } catch (error) {
        return next(error);
    }
}

export  {
    readCookies,
    signupUser,
    signinUser,
    signoutUser,
    googleAuth,
    generateOTP,
    verifyOTP,
    resendOTP,
    adminRoute,
    resetPassword,
    verifyUser,
    resendVerificationEmail
}