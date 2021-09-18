import { Request } from "express";
import httpStatus from "http-status";
import constants from "../constants";
import { ApiError } from "../errors/ApiError";
import { TokenPayload } from "../payload/auth.payload";

export class ApiUtils {

    static pick<T>(object: T, keys: string[]): T {
        const value: T = {} as T;
        keys.forEach(key => {
            if (object && ApiUtils.hasProperty(object, key)) {
                const k = key as keyof object;
                const v = object[key as keyof object];
                if (typeof v === "object") {
                    value[k] = { ...(v as any) } as never;
                    return;
                }
                value[k] = v;
            }
        });
        return value;
    }

    static copyTo<T>(from: any, to: T): T {
        if (!from || !to) {
            return to;
        }
        return Object.keys(to).reduce((obj, key) => {
            if (ApiUtils.hasProperty(from, key)) {
                const k = key as keyof T;
                obj[k] = from[k];
            }
            return obj;
        }, to);
    }

    static hasProperty(object: any, key: string) {
        return object.hasOwnProperty(key);
    }

    static enumToArray(e: any): string[] {
        const keys = Object.keys(e);
        const numericEnumKeys = keys.filter(val => isNaN(Number(val)) === false);
        const stringEnumKeys = keys.filter(val => isNaN(Number(val)) === true);
        return (numericEnumKeys.length === 0 ? stringEnumKeys : numericEnumKeys)
            .map(key => e[key]);
    }

    static getCurrentUserId(req: Request) {
        const token = req.decoded_token as TokenPayload;
        if (!token || !token._id) {
            throw new ApiError(httpStatus.UNAUTHORIZED, constants.messages.AUTHENTICATION_FAILED);
        }
        return token._id;
    }

    static async asyncForEach<T>(array: T[], callBack: (item: T, index?: number, array?: T[]) => Promise<void>) {
        for (let i = 0; i < array.length; i++) {
            await callBack(array[i], i, array);
        }
    }

    static async asyncMap<T, U>(array: T[], callBack: (item: T, index?: number, array?: T[]) => Promise<U>): Promise<U[]> {
        return Promise.all(array.map(callBack));
    }

}