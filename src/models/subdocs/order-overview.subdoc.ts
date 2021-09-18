import { Document, Schema } from "mongoose";
import { ApiUtils } from "../../utils/ApiUtils";
import { OrderStatus } from "../utils/OrderStatus";

export interface IOrderOverview extends Document<any> {
    status: OrderStatus;
    timeRequired: string;
    deliveryAgent: string;
}

export const orderOverviewSchema = new Schema<IOrderOverview>({
    status: {
        type: String,
        enum: ApiUtils.enumToArray(OrderStatus),
        get: (val: string) => OrderStatus[val as keyof typeof OrderStatus],
        set: (val: OrderStatus) => isNaN(Number(val)) === false ? OrderStatus[val] : val
    },
    timeRequired: { type: String },
    deliveryAgent: { type: String }
}, { toObject: { getters: true }, _id: false });