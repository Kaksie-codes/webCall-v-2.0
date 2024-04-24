import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    let statusCode: number;
    let message: string;

    if(err.name === 'CastError'){
        statusCode = 404,
        message = 'Resource not found'
    }else{
        statusCode = err.statusCode || 500;
        message = err.message || 'Internal Server Error';
    }

    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}