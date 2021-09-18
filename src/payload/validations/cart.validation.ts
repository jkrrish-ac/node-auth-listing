import constants from "../../constants";
import { ValidationSchema } from "../../utils/ValidationSchema";
import { ApiValidator } from "../validators/api.validator";

const productDetails = new ValidationSchema({
    definition: {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, use: { positive: ApiValidator.isPositive() } }
    },
    message: {
        required: (path) => `${path.substring(path.lastIndexOf(".") + 1)} is required`,
        positive: constants.messages.QUANTITY_SHOULD_BE_POSITVE
    }
});

export const cartRequest = new ValidationSchema({
    definition: {
        body: {
            products: {
                type: Array, use: { arrayValidation: ApiValidator.array(productDetails) }
            }
        }
    }
});