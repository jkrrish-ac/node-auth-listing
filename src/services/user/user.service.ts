import { ObjectId } from "mongoose";
import { IUser } from "../../models/user.model";
import { UserUpdateRequest } from "../../payload/user.payload";

export interface UserService {
    createUser(user: IUser): Promise<IUser>;
    getUser(id: string | ObjectId): Promise<IUser>;
    updateUser(req: UserUpdateRequest): Promise<IUser>;
}