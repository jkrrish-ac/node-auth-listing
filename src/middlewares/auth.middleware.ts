import assert from "assert";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { AccessControl as ac } from "../config/access-controll.config";
import constants from "../constants";
import { ApiError } from "../errors/ApiError";
import Role, { Actions, IRole, Permission } from "../models/role.model";
import { TokenPayload } from "../payload/auth.payload";
import { tokenService } from "../services/index.services";

export const isAuthorized = (action?: Actions, permission?: Permission) => (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, constants.messages.AUTHENTICATION_FAILED);
    }
    const verified = tokenService.verifyToken(token.split(constants.seperators.SPACE)[1]);
    if (verified.status) {
        assert(verified.decoded);
        const decoded = verified.decoded;
        req.decoded_token = decoded;
        req.decoded_token.roles = decoded.roles.map((role: string) => Role.getRole(role));
        if (action) {
            const payload = req.decoded_token as TokenPayload;
            assert.strict(token);
            if (checkAccess(payload, action, permission || ac.permissions.ALL)) {
                return next();
            }
            throw new ApiError(httpStatus.UNAUTHORIZED, constants.messages.AUTHORIZATION_FAILED);
        }
        return next();
    }
    throw new ApiError(httpStatus.UNAUTHORIZED, constants.messages.AUTHENTICATION_FAILED);
};

export const hasRole = (roles: IRole[] = []) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.decoded_token as TokenPayload;
        assert.strict(token);
        if (checkRole(token, roles)) {
            return next();
        }
        throw new ApiError(httpStatus.UNAUTHORIZED, constants.messages.AUTHORIZATION_FAILED);
    };
};

export const hasAccess = (action: Actions = ac.actions.ALL, permission: Permission = ac.permissions.ALL) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.decoded_token as TokenPayload;
        assert.strict(token);
        if (checkAccess(token, action, permission)) {
            return next();
        }
        throw new ApiError(httpStatus.UNAUTHORIZED, constants.messages.AUTHORIZATION_FAILED);
    };
};

const checkAccess = (token: TokenPayload, action: Actions, permission: Permission): boolean => {
    const userRoles: IRole[] = token.roles;
    return userRoles.some(role => {
        if (
            Role.hasPermission(role, ac.actions.ALL, ac.permissions.ALL) ||
            Role.hasPermission(role, ac.actions.ALL, permission) ||
            Role.hasPermission(role, action, ac.permissions.ALL)
        ) {
            return true;
        }
        return Role.hasPermission(role, action, permission);
    });
};

const checkRole = (token: TokenPayload, roles: IRole[]) => {
    const userRoles: IRole[] = token.roles;
    return userRoles.some(uRole => {
        return roles.some(role => role.name === uRole.name);
    });
};