import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/config";
import { IUser } from "../../models/user.model";
import { TokenService } from "./token.service";

export class DefaultTokenService implements TokenService {

    generateToken(user: IUser, secret: string = config.token.secret as string, expiry: string = config.token.expiry): Promise<string> {
        return new Promise((res, rej) => {
            const token = jwt.sign(
                {
                    _id: user.id,
                    email: user.email,
                    roles: user.roles.map(role => bcrypt.hashSync(role, config.roleHashRounds))
                },
                secret as string,
                {
                    expiresIn: expiry,
                }
            );
            res(token);
        });
    }

    verifyToken(token: string, secret: string = config.token.secret as string): { status: boolean, decoded: null | { [key: string]: any } } {
        try {
            const decoded = jwt.verify(token, secret as string) as object;
            if (decoded) {
                return { status: true, decoded };
            }
        } catch (error) {
            return { status: false, decoded: null };
        }
        return { status: false, decoded: null };
    }

}