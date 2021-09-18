import bcrypt from "bcrypt";
import httpStatus from "http-status";
import config from "../../config/config";
import constants from "../../constants";
import { ApiError } from "../../errors/ApiError";
import User, { IUser } from "../../models/user.model";
import { LoginRequest, LoginResponse, RegisterUserRequest } from "../../payload/auth.payload";
import { tokenService, userService } from "../index.services";
import { AuthService } from "./auth.service";


export class DefaultAuhService implements AuthService {

    async register(req: RegisterUserRequest): Promise<IUser> {
        try {
            const password = await bcrypt.hash(req.password, config.passwordHashRounds);
            req.password = password;
            return userService.createUser(RegisterUserRequest.create(req));
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, constants.messages.INTERNAL_SERVER_ERROR);
        }
    }

    async login(req: LoginRequest): Promise<LoginResponse> {
        const user = await User.findByEmailOrPassword(req.username, req.username);
        if (!user) {
            throw new ApiError(httpStatus.UNAUTHORIZED, constants.messages.AUTHENTICATION_FAILED);
        }

        return bcrypt.compare(req.password, user.password)
            .then(success => {
                if (success) {
                    return tokenService.generateToken(user as IUser);
                }
                throw new ApiError(httpStatus.UNAUTHORIZED, constants.messages.AUTHENTICATION_FAILED);
            })
            .then(token => Promise.resolve({ token } as LoginResponse));
    }


    validateToken(token: string): boolean {
        if (!token) {
            return false;
        }
        return tokenService.verifyToken(token.split(constants.seperators.SPACE)[1]).status;
    }

}