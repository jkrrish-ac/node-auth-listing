import validator from "validator";
import config from "../../config/config";
import constants from "../../constants";
import { ValidationSchema } from "../../utils/ValidationSchema";

export const registration = new ValidationSchema({
    definition: {
        body: {
            username: { type: String, required: true },
            email: { type: String, required: true, use: { email: validator.isEmail } },
            password: { type: String, required: true, length: { min: config.passwordMinLength }, match: config.passwordValidationRegEx }
        }
    },
    message: {
        required: (path) => `${path.substring(path.lastIndexOf(".") + 1)} is required`,
        email: constants.messages.INVALID_EMAIL,
        match: constants.messages.INVALID_PASSWORD_CONTENT,
        length: constants.messages.INVALID_PASSWORD_LENGTH
    }
});

export const login = new ValidationSchema({
    definition: {
        body: {
            username: { type: String, required: true },
            password: { type: String, required: true }
        }
    },
    message: { required: (path) => `${path.substring(path.lastIndexOf(".") + 1)} is required` }
});