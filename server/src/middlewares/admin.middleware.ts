import handleError from "../libs/handleError";
import { AuthenticatedRequest, CustomRequestHandler } from "../types/request";

const isAdmin: CustomRequestHandler = async (req:AuthenticatedRequest, res, next) => {
    try {
        if (!req.user) {
            throw new Error("User not authenticated");
        }

        if (req.user.role === 'admin') {
            next();
        } else {
            return handleError(403, 'Access denied because you are not an admin');
        }
    } catch (error) {
        next(error);
    }
}

export default isAdmin;