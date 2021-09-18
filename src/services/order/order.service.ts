import { IOrder, IOrderSearch } from "../../models/order.model";
import { PaginateOptions } from "../../models/plugins/paginate.plugin";
import { ApiPageResponse } from "../../payload/ApiPageResponse";
import { OrderOverviewRequest, OrderRequest, UserOrderGetRequest } from "../../payload/order.payload";

export interface OrderService {
    createOrder(order: OrderRequest): Promise<IOrder>;
    getOrderById(id: string): Promise<IOrder>;
    getUsersOrderById(req: UserOrderGetRequest): Promise<IOrder>;

    updateOrderOverview(status: OrderOverviewRequest): Promise<IOrder>;

    getOrderHistory(orderSearch: IOrderSearch, options: PaginateOptions): Promise<ApiPageResponse>;
}