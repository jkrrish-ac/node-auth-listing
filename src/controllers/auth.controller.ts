import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import constants from "../constants";
import { ApiResponse } from "../payload/ApiResponse";
import { LoginRequest, RegisterUserRequest } from "../payload/auth.payload";
import { UserResponse } from "../payload/user.payload";
import { authService } from "../services/index.services";

export const registerUser = (req: Request, res: Response, next: NextFunction) => {
    authService.register(req.body as RegisterUserRequest)
        .then(user => {
            ApiResponse.send(res, httpStatus.CREATED, {
                message: constants.messages.USER_REGISTERED,
                success: true,
                data: [UserResponse.create(user)]
            });
        }).catch(error => {
            next(error);
        });
};


export const login = (req: Request, res: Response, next: NextFunction) => {
    authService.login(req.body as LoginRequest)
        .then(loginResponse => {
            ApiResponse.send(res, httpStatus.OK, {
                message: constants.messages.LOGIN_SUCCESS,
                success: true,
                data: [loginResponse]
            });
        })
        .catch(error => next(error));
};

export const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const validated = authService.validateToken(req.headers.authorization);
    ApiResponse.send(res, validated ? httpStatus.OK : httpStatus.BAD_REQUEST, {
        message: validated ? constants.messages.TOKEN_VALID : constants.messages.TOKEN_INVALID,
        success: validated
    });
};