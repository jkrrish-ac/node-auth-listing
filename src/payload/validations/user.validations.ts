import constants from "../../constants";
import { ValidationSchema } from "../../utils/ValidationSchema";

export const update = new ValidationSchema({
    definition: {
        body: {
            id: { type: String, required: true, message: constants.messages.USER_ID_IS_REQUIRED }
        }
    }
});