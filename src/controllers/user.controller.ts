import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import constants from "../constants";
import { ApiError } from "../errors/ApiError";
import { ApiResponse } from "../payload/ApiResponse";
import { UserResponse, UserUpdateRequest } from "../payload/user.payload";
import { userService } from "../services/index.services";

export const getLoggedInUser = (req: Request, res: Response, next: NextFunction) => {
    const decoded_token: any = req.decoded_token;
    if (!decoded_token) {
        throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.AUTH_TOKEN_NOT_VALID);
    }

    userService.getUser(decoded_token._id)
        .then(usr => ApiResponse.send(res, httpStatus.OK, {
            success: true,
            message: constants.messages.USER_FOUND,
            data: [UserResponse.create(usr)]
        }))
        .catch(err => next(err));
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
    userService.updateUser(req.body as UserUpdateRequest)
        .then(user => ApiResponse.send(res, httpStatus.OK, {
            success: true,
            message: constants.messages.USER_UPDATED,
            data: [
                UserResponse.create(user)
            ]
        }))
        .catch(err => next(err));
};