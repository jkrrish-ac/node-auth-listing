import httpStatus from "http-status";
import { ObjectId } from "mongoose";
import constants from "../../constants";
import { ApiError } from "../../errors/ApiError";
import User, { IUser } from "../../models/user.model";
import { UserUpdateRequest } from "../../payload/user.payload";
import { UserService } from "./user.service";

export class DefaultUserService implements UserService {

    async createUser(user: IUser): Promise<IUser> {
        if (await User.isEmailTaken(user.email, user._id) || await User.isUserNameTaken(user.username, user._id)) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.EMAIL_USERNAME_ALREADY_TAKEN);
        }
        user.roles = [constants.ROLE_USER];
        return User.build(user).save();
    }


    async getUser(id: string | ObjectId): Promise<IUser> {
        const user = await User.findById(id).exec();
        if (user != null) {
            return Promise.resolve(user);
        }
        throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.USER_NOT_FOUND);
    }

    async updateUser(req: UserUpdateRequest): Promise<IUser> {
        const usr = await this.getUser(req.id);
        if (req.address) {
            usr.address = req.address;
        }

        if (req.username) {
            usr.username = req.username;
        }
        return usr.save();
    }

}