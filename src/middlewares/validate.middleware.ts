import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import constants from "../constants";
import { ApiError } from "../errors/ApiError";
import { ApiUtils } from "../utils/ApiUtils";
import { ValidationSchema } from "../utils/ValidationSchema";

export const validate = (schema: ValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
    const object = ApiUtils.pick(
        req,
        Object.keys(
            ApiUtils.pick(schema.definition, ["params", "body", "query"])
        )
    );
    const errors: any[] = schema.validate(object, { strip: false });
    if (errors && errors.length >= 1) {
        const message = errors.map(err => err.message).join(constants.seperators.COMMA_SPACE);
        return next(new ApiError(httpStatus.BAD_REQUEST, message));
    }
    ApiUtils.copyTo(object, req);
    next();
};