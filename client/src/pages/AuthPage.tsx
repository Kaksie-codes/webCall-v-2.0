import SignIn from "@/components/SignIn";
import SignUp from "@/components/SignUp";
import { UserContext } from "@/context/usercontext/UserContext";
import { setAuthPageModeAction } from "@/reducers/user-reducer/userActions";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AnimationWrapper from "@/components/animation/AnimationWrapper";

export interface FormData {    
    username?: string;
    email?: string;
    password?: string;
    passwordCheck?:string;    
}

const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
};

const containerVariants = {
    animate: {
        opacity: 1,
        transition: {
            duration: 1,
            delay: 1,
            staggerChildren: 0.2
        }
    },
    initial: { opacity: 0 }
};

const AuthPage = () => {
    const { state, dispatchUser } = useContext(UserContext);

    return (
        <div className="grid place-items-center min-h-screen">
            <Link to={'/'} className='flex items-center justify-center gap-1 fixed top-3 left-6'>
                <img src='/icons/logo.svg' alt="logo" className='flex-none w-6 lg:w-10'/>
                <p className="text-[26px] text-white font-extrabold max-sm:hidden">webCall</p>
            </Link>
            <div className="max-h-[85vh] bg-white relative overflow-hidden w-[90vw] xl:w-[70vw] max-w-[500px] lg:max-w-[1000px] px-5 py-8 rounded-[15px] shadow-lg">
                <div className={`hidden lg:block absolute top-0 ${state.authPageMode == 'sign-in' ? 'translate-x-full' : 'translate-x-0'} -left-[50%] w-full h-full bg-gradient-to-l from-blue-400 to-blue-600 z-20 transform  transition duration-1000 ease-in-out`}></div>
                <div className="w-full h-full flex items-center gap-12 justify-between  px-8">
                    <SignIn />
                    <SignUp />
                </div>
                <AnimatePresence>
                    {state.authPageMode === 'sign-in' && (
                        <div className="hidden lg:flex lg:top-0 lg:right-0 lg:z-50 absolute px-12  place-content-center h-full w-[50%]">
                            <AnimationWrapper                                
                                elementKey="sign-in"  
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                transition={{ duration: 1, delay: 0.4 }}
                                className="w-full h-full lg:flex  place-content-center "
                            >
                                <motion.div
                                    variants={containerVariants}                              
                                    className="text-white text-center flex gap-3 justify-center flex-col items-center"
                                >
                                    <motion.h1 variants={itemVariants} className="text-4xl  font-gelasio">New to webCall?</motion.h1>
                                    <motion.p variants={itemVariants}>Register with your personal details to use all of enBlogg features</motion.p>
                                    <motion.button
                                        variants={itemVariants}
                                        className="btn-dark"                                        
                                        onClick={() => dispatchUser(setAuthPageModeAction('sign-up'))}
                                    >
                                        Join us today
                                    </motion.button>
                                </motion.div>
                            </AnimationWrapper>
                        </div>
                    )}
                    {state.authPageMode === 'sign-up' && (
                        <div className="hidden lg:block lg:top-0 lg:left-0 lg:z-50 absolute px-12 h-full w-[50%]">
                            <AnimationWrapper 
                                elementKey="sign-up"                                
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                transition={{ duration: 1, delay: 0.4 }}
                                className="w-full h-full lg:flex  place-content-center "
                            >
                                <motion.div variants={containerVariants} className="text-white text-center flex gap-3 justify-center flex-col items-center">
                                    <motion.h1 variants={itemVariants} className="text-4xl  font-gelasio capitalize">Welcome Back</motion.h1>
                                    <motion.p variants={itemVariants}>Enter your personal details to use all of enBlogg features</motion.p>
                                    <motion.button
                                        variants={itemVariants} 
                                        className="btn-dark"                                        
                                        onClick={() => dispatchUser(setAuthPageModeAction('sign-in'))}
                                    >
                                        Log in
                                    </motion.button>
                                </motion.div>
                            </AnimationWrapper>                           
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AuthPage;
