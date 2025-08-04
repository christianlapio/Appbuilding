import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';
export declare const errorHandler: (error: Error, req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
//# sourceMappingURL=errorHandler.d.ts.map