import { ObjectId } from "mongoose";
import { Readable } from "stream";
import { IFile } from "../../models/file.model";
import { PaginateOptions } from "../../models/plugins/paginate.plugin";
import { IProduct, IProductSearch } from "../../models/product.model";
import { ApiPageResponse } from "../../payload/ApiPageResponse";
import { ProductRequest, ProductUpdateRequest } from "../../payload/products.payload";

export interface ProductService {
    getProducts(search: IProductSearch, options: PaginateOptions): Promise<ApiPageResponse>;
    getProductById(id: string | ObjectId): Promise<IProduct>;
    addProduct(product: ProductRequest): Promise<IProduct>;
    updateProduct(product: ProductUpdateRequest): Promise<IProduct>;
    getProductImage(imageId: string): Promise<{ readable: Readable, file: IFile }>;
}