import httpStatus from "http-status";
import constants from "../../constants";
import { ApiError } from "../../errors/ApiError";
import Order, { IOrder, IOrderSearch } from "../../models/order.model";
import { PaginateOptions } from "../../models/plugins/paginate.plugin";
import { IProduct } from "../../models/product.model";
import { IProductDetails } from "../../models/subdocs/product-details.subdoc";
import { OrderStatus } from "../../models/utils/OrderStatus";
import { ApiPageResponse } from "../../payload/ApiPageResponse";
import { OrderOverviewRequest, OrderRequest, OrderResponse, UserOrderGetRequest } from "../../payload/order.payload";
import { productService, userService } from "../index.services";
import { OrderService } from "./order.service";

export class DefaultOrderService implements OrderService {

    async createOrder(order: OrderRequest): Promise<IOrder> {
        await this.checkIfUserExists(order.userId);
        let total = 0;
        for (const product of order.products) {
            total += await this.calculateAmount(product);
        }

        return Order.build({
            products: order.products,
            userId: order.userId,
            totalAmount: total,
            overview: {
                status: OrderStatus.PENDING,
                timeRequired: constants.seperators.EMPTY,
                deliveryAgent: constants.seperators.EMPTY
            }
        } as IOrder).save();
    }

    async getOrderById(id: string): Promise<IOrder> {
        const order = await Order.findById(id).exec();
        if (!order) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.ORDER_NOT_FOUND);
        }
        return order;
    }

    async getUsersOrderById(req: UserOrderGetRequest): Promise<IOrder> {
        await this.checkIfUserExists(req.userId);
        const order = await Order.findById(req.orderId).exec();
        if (!order || order.userId !== req.userId) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.ORDER_NOT_FOUND);
        }
        return order;
    }

    async updateOrderOverview(req: OrderOverviewRequest): Promise<IOrder> {
        const order = await this.getOrderById(req.orderId);
        const overview = order.overview;
        overview.timeRequired = req.timeRequired ? req.timeRequired : overview.timeRequired;
        overview.deliveryAgent = req.agent ? req.agent : overview.deliveryAgent;
        overview.status = req.status ? req.status : overview.status;
        return order.save();
    }

    async getOrderHistory(orderSearch: IOrderSearch, options: PaginateOptions): Promise<ApiPageResponse> {
        const page = await Order.paginate(orderSearch, options);
        page.data = page.data.map(order => OrderResponse.create(order));
        return page;
    }

    private async checkIfUserExists(userId: string) {
        const user = await userService.getUser(userId);
        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.USER_NOT_FOUND);
        }
    }

    private async checkIfProductsExists(productId: string): Promise<IProduct> {
        const product = await productService.getProductById(productId);
        if (!product) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.PRODUCT_NOT_FOUND);
        }
        return product;
    }

    private async calculateAmount(orderDetails: IProductDetails): Promise<number> {
        return this.checkIfProductsExists(orderDetails.productId)
            .then((product) => product.cost * orderDetails.quantity);
    }

}