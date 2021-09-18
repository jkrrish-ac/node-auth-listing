import { Document, Schema } from "mongoose";
import { productService } from "../../services/index.services";
import { ApiUtils } from "../../utils/ApiUtils";
import { IProductDetails, productDetailsSchema } from "./product-details.subdoc";

export interface ICart extends Document<any> {
    products: IProductDetails[];

    totalAmount(): Promise<number>;
}

export const cartSchema = new Schema<ICart>({
    products: { type: [productDetailsSchema], default: [] }
}, { _id: false });

cartSchema.methods.totalAmount = async function () {
    let total = 0;
    await ApiUtils.asyncForEach(this.products, async (productDetail) => {
        const product = await productService.getProductById(productDetail.productId);
        total += product.cost * productDetail.quantity;
    });
    return total;
};