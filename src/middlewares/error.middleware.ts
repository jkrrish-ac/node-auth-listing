import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError";
import { ApiResponse } from "../payload/ApiResponse";


const errorConvertor = (err: Error) => {
    if (err instanceof ApiError) {
        return err as ApiError;
    }
    const error = err as Error & { statusCode: number };
    const apiError = new ApiError(error.statusCode || httpStatus.BAD_REQUEST, err.message || httpStatus[error.statusCode] as string);
    apiError.stack = error.stack;
    return apiError;
};


const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const error = errorConvertor(err);
    ApiResponse.send(res, error.statusCode, { message: error.message, success: false });
};

export { errorHandler };
