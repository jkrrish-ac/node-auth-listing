import { IUser } from "../../models/user.model";
import { LoginRequest, LoginResponse, RegisterUserRequest } from "../../payload/auth.payload";

export interface AuthService {
    register(req: RegisterUserRequest): Promise<IUser>;
    login(req: LoginRequest): Promise<LoginResponse>;
    validateToken(token: string | undefined): boolean;
}