"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    // Default error response
    let statusCode = 500;
    let message = 'Internal server error';
    // Handle specific error types
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    }
    else if (error.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    }
    else if (error.name === 'NotFoundError') {
        statusCode = 404;
        message = 'Resource not found';
    }
    else if (error.message.includes('API key')) {
        statusCode = 401;
        message = 'Invalid API key';
    }
    else if (error.message.includes('rate limit')) {
        statusCode = 429;
        message = 'Rate limit exceeded';
    }
    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};
exports.errorHandler = errorHandler;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
//# sourceMappingURL=errorHandler.js.map