import mongoose, { Document, Model, ObjectId, Schema } from "mongoose";
import validator from "validator";
import { AccessControl } from "../config/access-controll.config";
import constants from "../constants";
import { RoleType } from "./role.model";
import { cartSchema, ICart } from "./subdocs/cart.subdoc";

export interface IUser extends Document<any> {
    username: string;
    password: string;
    email: string;
    address: string;
    roles: string[];

    cart: ICart;
}

// custom functions
export interface IUserModel extends Model<IUser> {
    build(user: IUser): IUser;
    isEmailTaken(email: string, exclude: ObjectId): Promise<boolean>;
    isUserNameTaken(userName: string, exclude: ObjectId): Promise<boolean>;
    findByEmailOrPassword(username: string, email: string): Promise<IUser>;
}

const userSchema = new Schema<IUser, IUserModel>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, validate: [validator.isEmail, constants.messages.INVALID_EMAIL] },
    address: { type: String },
    roles: {
        type: [String],
        required: true,
        enum: Object.keys(AccessControl.roles).map(k => AccessControl.roles[k as RoleType].name)
    },

    cart: { type: cartSchema, required: false, default: {} }
});

userSchema.statics.build = (user: IUser) => {
    return new User(user);
};

userSchema.statics.isEmailTaken = async function (email: string, exclude?: ObjectId): Promise<boolean> {
    const user = await this.findOne({ email, _id: { $ne: exclude } });
    return !!user;
};

userSchema.statics.isUserNameTaken = async function (userName: string, exclude?: ObjectId): Promise<boolean> {
    const user = await this.findOne({ username: userName, _id: { $ne: exclude } });
    return !!user;
};

userSchema.statics.findByEmailOrPassword = async function (username: string, email: string): Promise<IUser | null> {
    return this.findOne({ $or: [{ email }, { username }] }).exec();
};

// tslint:disable-next-line:variable-name
const User = mongoose.model<IUser, IUserModel>(constants.models.USER, userSchema);
export default User;