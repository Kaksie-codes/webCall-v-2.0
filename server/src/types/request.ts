import { NextFunction, Request, Response } from "express";
import { IUser } from "./user";

// Define a custom request interface that extends the Express Request interface
export interface AuthenticatedRequest extends Request {
    user?: IUser; // Include the user property, specifying the IUser type
}

export type CustomRequestHandler = (req: Request, res: Response, next: NextFunction) => any;