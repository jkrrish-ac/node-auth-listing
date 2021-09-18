import { IProduct } from "../models/product.model";
import { IProductDetails } from "../models/subdocs/product-details.subdoc";
import { productService } from "../services/index.services";

export class ProductResponse {
    static create(product: IProduct) {
        return {
            id: product._id,
            name: product.name,
            details: product.details,
            cost: product.cost,
            createdAt: product.createdAt,
            images: product.images
        };
    }
}
export interface ProductUpdateRequest {
    id: string;
    name?: string;
    details?: string;
    cost?: number;
    images: Express.Multer.File[];
    deleteImages: string;
}
export interface ProductRequest {
    name: string;
    details: string;
    cost: number;
    images: Express.Multer.File[];
}

export class ProductDetailResponse {
    static async create(productDetail: IProductDetails) {
        const product = await productService.getProductById(productDetail.productId);
        return {
            product: ProductResponse.create(product),
            quantity: productDetail.quantity,
            cost: product.cost * productDetail.quantity
        };
    }
}