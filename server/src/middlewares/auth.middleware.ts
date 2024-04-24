import { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import handleError from "../libs/handleError";
import User from "../models/user.model";
import jwt from 'jsonwebtoken'

// Define a new interface that extends the Request interface
interface AuthenticatedRequest extends Request {
    user?: any; // Define the user property here
}


const authenticateUser = async (req: AuthenticatedRequest, res:Response, next:NextFunction ) => {
    let token

    // Get token from header
    token = req.cookies.jwt ;

    if(token){
        try{
            // Verify token
            const decoded: string | JwtPayload  = jwt.verify(token, process.env.SECRET_ACCESS_KEY!);

            // Check if decoded is a string (invalid token)
            if (typeof decoded === 'string') {
                throw new Error('Invalid token');
            }

            // Get user from the token
            req.user = await User.findById(decoded.userId).select('-personal_info.password');
            // console.log('user >>', req.user)
            // run the next middleware
            next()
        }catch(error){
            // console.log(error);
            return next(handleError(401, 'Unauthorized, invalid token'));
        }
    }else{
        return next(handleError(401, 'Unauthorized, no token'));
    }
}

export default authenticateUser