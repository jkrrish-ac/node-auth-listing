import { Document, Model, model, Schema } from "mongoose";
import constants from "../constants";
import { ApiPageResponse } from "../payload/ApiPageResponse";
import { Filter, paginate, PaginateOptions } from "./plugins/paginate.plugin";
import { IOrderOverview, orderOverviewSchema } from "./subdocs/order-overview.subdoc";
import { IProductDetails, productDetailsSchema } from "./subdocs/product-details.subdoc";

export interface IOrder extends Document<any> {
    products: IProductDetails[];
    userId: string;
    totalAmount: number;
    overview: IOrderOverview;

    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderModel extends Model<IOrder> {
    build(order: IOrder): IOrder;
    paginate(filter: IOrderSearch, options: PaginateOptions): Promise<ApiPageResponse>;
}

export class IOrderSearch implements Filter<IOrder> {
    constructor(
        readonly userId?: string
    ) { }

    getQuery() {
        const query: { [key: string]: any } = {};
        if (this.userId) {
            query.userId = this.userId;
        }
        return query;
    }
}

const orderSchema = new Schema<IOrder, IOrderModel>({
    userId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    products: { type: [productDetailsSchema], required: true },
    overview: { type: orderOverviewSchema, required: true }
});

orderSchema.plugin(paginate);

orderSchema.statics.build = (order: IOrder): IOrder => {
    return new Order(order);
};

// tslint:disable-next-line:variable-name
const Order = model(constants.models.ORDER, orderSchema);
export default Order;