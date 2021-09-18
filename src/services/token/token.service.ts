import { IUser } from "../../models/user.model";

export interface TokenService {
    generateToken(user: IUser, secret?: string, expiry?: string): Promise<string>;
    verifyToken(token: string, secret?: string): { status: boolean, decoded: null | { [key: string]: any } };
}