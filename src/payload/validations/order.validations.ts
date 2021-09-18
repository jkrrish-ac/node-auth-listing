import constants from "../../constants";
import { OrderStatus } from "../../models/utils/OrderStatus";
import { ApiUtils } from "../../utils/ApiUtils";
import { ValidationSchema } from "../../utils/ValidationSchema";

export const orderOverviewRequest = new ValidationSchema({
    definition: {
        body: {
            orderId: { type: String, required: true },
            status: { type: String, enum: ApiUtils.enumToArray(OrderStatus) }
        }
    },
    message: {
        required: constants.messages.ORDER_ID_IS_REQUIRED,
        enum: `Invalid status, must be one of ${ApiUtils.enumToArray(OrderStatus).join(constants.seperators.COMMA_SPACE)} `
    }
});