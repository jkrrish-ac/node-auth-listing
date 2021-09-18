import dotenv from "dotenv";
import httpStatus from "http-status";
import Schema from "validate";
import constants from "../constants";
import { ApiError } from "../errors/ApiError";

dotenv.config();

const envSchema = new Schema({
    DB_URL: { type: String, required: true, message: constants.messages.DATA_BASE_URL_NOT_SET },
    TOKEN_SECRET: { type: String, required: true, message: constants.messages.TOKEN_SECRET_NOT_SET }
});

const errors: any[] = envSchema.validate(process.env, { strip: false });
if (errors && errors.length >= 1) {
    const message = errors.map(err => err.message as string).join(constants.seperators.COMMA_SPACE);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `ConfigurationValidationError: ${message}`);
}

const config = {
    port: process.env.PORT || constants.DEFAULT_PORT,
    db: {
        url: process.env.DB_URL as string,
        options: {
            useNewUrlParser: true,
            user: process.env.DB_USER,
            pass: process.env.DB_PASS,
            useUnifiedTopology: true
        }
    },
    logger: {
        level: process.env.LOG_LEVEL || constants.LOGGER_LEVEL,
        timestampFormat: process.env.LOG_TIME_STAMP_FORMAT || constants.LOGGER_TIME_STAMP_FORMAT,
        label: process.env.LOG_LABEL || constants.LOGGER_LABEL
    },
    passwordMinLength: constants.PASSWORD_MIN_LENGTH,
    passwordValidationRegEx: constants.PASSWORD_VALIDATION_REG_EXP,
    passwordHashRounds: constants.PASSWORD_HASH_ROUNDS,
    roleHashRounds: constants.ROLE_HASH_ROUNDS,
    token: {
        secret: process.env.TOKEN_SECRET,
        expiry: process.env.TOKEN_EXPIRY || constants.DEFAULT_TOKEN_EXPIRY
    },
    supportedImagetypes: constants.SUPPORTED_IMAGE_TYPES,
};


export default config;