import validator from "validator";
import constants from "../../constants";
import { ValidationSchema } from "../../utils/ValidationSchema";

export const productRequest = new ValidationSchema({
    definition: {
        body: {
            name: { type: String, required: true },
            details: { type: String, required: true },
            cost: { type: String, required: true, use: { numeric: validator.isNumeric, positive: (val) => parseFloat(val) >= 0 } },
        }
    },

    message: {
        required: (path: string) => `${path.substring(path.lastIndexOf(".") + 1)} is required`,
        numeric: constants.messages.COST_SHOULD_BE_A_NUMBER,
        positive: constants.messages.COST_SHOULD_BE_POSITIVE
    }
});

export const update = new ValidationSchema({
    definition: {
        body: {
            id: { type: String, required: true, message: constants.messages.PRODUCT_ID_REQUIRED }
        }
    }
});