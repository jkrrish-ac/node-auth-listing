import { Document, Schema } from "mongoose";
import constants from "../../constants";

export interface IProductDetails extends Document<any> {
    productId: string;
    quantity: number;
}


export const productDetailsSchema = new Schema<IProductDetails>({
    productId: { type: String, required: true },
    quantity: {
        type: Number,
        required: true,
        min: [0, constants.messages.QUANTITY_SHOULD_BE_POSITVE]
    }
}, { _id: false });