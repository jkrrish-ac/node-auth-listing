import { IOrder } from "../models/order.model";
import { IProductDetails } from "../models/subdocs/product-details.subdoc";
import { OrderStatus } from "../models/utils/OrderStatus";
import { ApiUtils } from "../utils/ApiUtils";
import { ProductDetailResponse } from "./products.payload";

export interface OrderRequest {
    userId: string;
    products: IProductDetails[];
}

export interface UserOrderGetRequest {
    userId: string;
    orderId: string;
}

export interface OrderOverviewRequest {
    orderId: string;
    status?: OrderStatus;
    timeRequired?: string;
    agent?: string;
}

export class OrderResponse {
    static async create(order: IOrder) {
        return {
            _id: order._id,
            createdAt: order.createdAt,
            userId: order.userId,
            products: await ApiUtils.asyncMap(order.products, product => ProductDetailResponse.create(product)),
            totalAmount: order.totalAmount,
            overview: order.overview
        };
    }
}