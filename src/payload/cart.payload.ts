import { ICart } from "../models/subdocs/cart.subdoc";
import { IProductDetails } from "../models/subdocs/product-details.subdoc";
import { cartService } from "../services/index.services";
import { ApiUtils } from "../utils/ApiUtils";
import { ProductDetailResponse } from "./products.payload";

export interface CartRequest {
    userId: string;
    products: IProductDetails[];
}

export class CartResponse {
    static async create(cart: ICart) {
        return {
            products: await ApiUtils.asyncMap(cart.products, product => ProductDetailResponse.create(product)),
            totalAmount: await cartService.getTotalAmount(cart)
        };
    }
}