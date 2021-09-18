import { IUser } from "../models/user.model";

export interface UserUpdateRequest {
    id: string;
    username?: string;
    address?: string;
}
export class UserResponse {
    static create(user: IUser) {
        return {
            _id: user.id,
            username: user.username,
            email: user.email,
            address: !user.address ? null : user.address,
            roles: user.roles
        };
    }
}