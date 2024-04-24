import jwt from 'jsonwebtoken'
import { Response } from 'express'

const generateToken = (res: Response, userId: string) => {
    const accessToken = jwt.sign({ userId }, process.env.SECRET_ACCESS_KEY!, {
        expiresIn: '24h'
    });

    res.cookie('jwt', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    });
};

// expiresIn: '24h'
export default generateToken;