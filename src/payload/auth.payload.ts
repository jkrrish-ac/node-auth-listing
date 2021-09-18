import { IRole } from "../models/role.model";
import { IUser } from "../models/user.model";

export class RegisterUserRequest {
    username!: string;
    email!: string;
    password!: string;

    static create(req: RegisterUserRequest) {
        return { ...req } as IUser;
    }
}

export interface TokenPayload {
    _id: string;
    email: string;
    roles: IRole[];
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}