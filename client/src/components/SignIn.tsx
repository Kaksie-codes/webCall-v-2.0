import { FormData } from "@/pages/AuthPage";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "./Oauth";
import InputBox from "./InputBox";
import { UserContext } from "@/context/usercontext/UserContext";
import AnimationWrapper from "./animation/AnimationWrapper";
import { setAuthAction, setUserAction } from "@/reducers/user-reducer/userActions";

const SignIn = () => {
  const { state, dispatchUser } = useContext(UserContext);  
  const navigate = useNavigate();  
  const [isLoading, setIsloading] = useState(false);    
  // const { userInfo: { isVerified }, authPageMode } = state; 
  // console.log('userInfo ----->>>', state)

  let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email    

  const [signInData, setSignInData] = useState({        
      email:"", 
      password:"",   
      }); 

  const [validationErrors, setValidationErrors] = useState<FormData>({        
      email:"", 
      password:"",       
  })   

  const handleChange = (e:any) => {        
      const { value, name } = e.target;
      setSignInData({            
          ...signInData,
          [name]: value.trim()                 
      }) 
  }

  const validateForm = () => {
      const validationErrors: Partial<FormData> = {};
      
      if (!signInData.email.trim()) {
          validationErrors.email = 'Email is required';
      } else if (!emailRegex.test(signInData.email)) {
          validationErrors.email = 'Email is invalid';
      }
  
      if (!signInData.password.trim()) {
          validationErrors.password = 'Password is required';
      }
  
      setValidationErrors(validationErrors as FormData);
  
      // If there are any validation errors, return false
      return Object.keys(validationErrors).length === 0;
  }
  

const handleSubmit = async (e: any) => {
  e.preventDefault();
  setIsloading(true);

  // Check if the form is valid
  const isValidForm = validateForm();

  // If the form is not valid, stop form submission
  if (!isValidForm) {
      setIsloading(false);
      return;
  }

  try {
      // Submit the form data
      const res = await fetch(`/api/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signInData),
      });
      const result = await res.json();
      const { user } = result;


      if (result.success === false) {
          toast.error(result.message);
      } else {
        const {fullname, profileImg, role, userId, username, verified, email } = user

          // // Ensure that profileImg is correctly populated here
          // console.log('User from backend:', user);
          // console.log('Profile image from backend:', profileImg);
        
        dispatchUser(setUserAction({
          fullname,
          profileImg,
          role,
          userId,
          email,
          username,
          isVerified: verified
        }));
        dispatchUser(setAuthAction(true));
        navigate('/home');
      }
  } catch (err) {
      console.log('backend error >>', err);
      // toast.error(err?.data?.message)
  } finally {
      setIsloading(false);
  }
}
  return (
<div className={` w-full lg:w-[45%]  ${state.authPageMode == 'sign-in' ? 'block' : 'hidden'} lg:block text-black `}>
                    <AnimationWrapper                                 
                                elementKey="sign-in" 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                transition={{ duration: 1, delay: 0.4 }}>
                      
                          <div className="flex flex-col items-center">
                              <form className="w-full" >
                                  <h1 className="text-4xl mb-3 font-gelasio capitalize text-center">
                                      Welcome back
                                  </h1>
                                  <InputBox
                                      name="email"
                                      type='email'
                                      placeholder="Email"
                                      // id='email'
                                      onChange={handleChange}
                                      icon="fi-rr-envelope"
                                      value={signInData.email}
                                      errorMessage={validationErrors.email}
                                  />
                                  <InputBox
                                      name="password"
                                      type='password'
                                      placeholder="Password"
                                      // id='password'
                                      onChange={handleChange}
                                      icon="fi-rr-key"
                                      value={signInData.password}
                                      errorMessage={validationErrors.password}
                                  />
                                  <div className="text-center">
                                    <button
                                        onClick={handleSubmit}
                                        type="submit"
                                        disabled={isLoading}
                                        className={`btn-dark center  ${isLoading ? 'cursor-not-allowed' : ''}`}
                                    >
                                        {
                                            isLoading ? <span className="animate-pulse">Signing in...</span> : <span>Sign In</span>
                                        }
                                    </button>
                                  </div>
                              </form>
                              <div className="relative w-full my-4 flex items-center gap-2 opacity-10 uppercase text-black font-bold">
                                      <hr className="w-1/2 border-black"/>
                                      <hr className="w-1/2 border-black"/>
                              </div>
                              <Oauth/>
                              <p className="text-center w-full mt-2">
                                  <Link
                                      className=" text-white  text-xl underline "
                                      to={'/reset-password'}>
                                      Forgot Password
                                  </Link>
                              </p>
                              <p className="mt-4 text-dark-grey text-xl text-center lg:hidden">
                                  Don't have an account ?
                                  <button
                                      className="underline text-black text-xl ml-1"
                                      // onClick={() => dispatch(setAuthPageMode('sign-up'))}
                                >
                                      Join us today
                                  </button>
                              </p>
                          </div>
                      
                    </AnimationWrapper>
                </div>
  )
}

export default SignIn