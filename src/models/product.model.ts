import mongoose, { Document, Model, Schema } from "mongoose";
import constants from "../constants";
import { ApiPageResponse } from "../payload/ApiPageResponse";
import { Filter, paginate, PaginateOptions } from "./plugins/paginate.plugin";

export interface IProduct extends Document<any> {
    name: string;
    details: string;
    cost: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;

}

export interface IProductModel extends Model<IProduct> {
    build(product: IProduct): IProduct;
    paginate(filter: IProductSearch, options: PaginateOptions): Promise<ApiPageResponse>;
    existsByName(name: string): Promise<boolean>;
}

export class IProductSearch implements Filter<IProduct> {
    constructor(
        readonly name?: string,
        readonly details?: string
    ) { }

    getQuery() {
        const query: { [key: string]: any } = {};
        if (this.name) {
            query.name = { $regex: `^${this.name}`, $options: "i" };
        }

        if (this.details) {
            query.details = { $regex: `${this.details}` };
        }
        return query;
    }
}

const productSchema = new Schema<IProduct, IProductModel>({
    name: { type: String, required: true },
    details: { type: String, required: true },
    cost: { type: Number, required: true },
    images: { type: [String] }
}, { timestamps: true });

productSchema.plugin(paginate);

productSchema.statics.build = (product: IProduct) => {
    return new Product(product);
};

productSchema.statics.existsByName = async (name: string): Promise<boolean> => {
    if (!name) {
        return false;
    }
    const product = await Product.findOne({ name });
    return !!product;
};

// tslint:disable-next-line:variable-name
const Product = mongoose.model<IProduct, IProductModel>(constants.models.PRODUCT, productSchema);
export default Product;