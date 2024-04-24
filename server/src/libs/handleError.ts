interface CustomError extends Error {
    statusCode: number;
}

const handleError = (statusCode: number, message: string): CustomError => {
    const error = new Error(message) as CustomError; // Type assertion
    error.statusCode = statusCode;
    return error;
};

export default handleError;