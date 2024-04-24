import { Router } from "express";
import {
    signupUser,
    signinUser,
    signoutUser,
    googleAuth,
    generateOTP,
    verifyOTP,
    resetPassword,
    resendOTP,
    adminRoute,
    verifyUser,
    resendVerificationEmail,
    readCookies
} from '../controllers/auth.controller'

import authenticateUser from "../middlewares/auth.middleware";
import isAdmin from "../middlewares/admin.middleware";

// Initialize the router
const router = Router();

// Signup
router.post('/signup', signupUser);

// Signin
router.post('/signin', signinUser);

// Signout
router.get('/signout', signoutUser);

// Read Cookies
router.get('/read-cookies', readCookies);

// generate OTP
router.post('/generateOTP', generateOTP);

// verify OTP
router.post('/verifyOTP', verifyOTP);

// resend verification Mail
router.get('/resendVerificationMail/:id', resendVerificationEmail);

// verify User
router.get('/:id/verify/:token', verifyUser);

// Create or Reset Session
router.get('/resendOTP', resendOTP);

// Google Auth
router.post('/google-auth', googleAuth);

// private routes
router.post('/resetPassword', authenticateUser, resetPassword);

// Admin routes
router.get('/admin', authenticateUser, isAdmin,  adminRoute);


export default router;