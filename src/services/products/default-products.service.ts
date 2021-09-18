import httpStatus from "http-status";
import mongoose from "mongoose";
import { Readable } from "stream";
import constants from "../../constants";
import { ApiError } from "../../errors/ApiError";
import { IFile } from "../../models/file.model";
import { PaginateOptions } from "../../models/plugins/paginate.plugin";
import Product, { IProduct, IProductSearch } from "../../models/product.model";
import { ApiPageResponse } from "../../payload/ApiPageResponse";
import { ProductRequest, ProductResponse, ProductUpdateRequest } from "../../payload/products.payload";
import { fsService } from "../index.services";
import { ProductService } from "./product.service";

export class DefaultProductService implements ProductService {


    async getProductById(id: string): Promise<IProduct> {
        let _id: any;
        try {
            _id = mongoose.Types.ObjectId(id);
        } catch {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.PRODUCT_NOT_FOUND);
        }
        const product = await Product.findById({ _id }).exec();
        if (product != null) {
            return Promise.resolve(product);
        }
        throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.PRODUCT_NOT_FOUND);
    }

    async getProducts(search: IProductSearch, options: PaginateOptions): Promise<ApiPageResponse> {
        const page = await Product.paginate(search, options);
        page.data = page.data.map(product => ProductResponse.create(product));
        return Promise.resolve(page);
    }

    async addProduct(product: ProductRequest): Promise<IProduct> {
        if (await Product.existsByName(product.name)) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.PRODUCT_ALREADY_EXISTS);
        }

        let imagePromises: Promise<IFile>[] = [];
        if (product.images && product.images.length > 0) {
            imagePromises = product.images.map((image) => fsService.save(image));
        }

        return Promise.all(imagePromises).then(images => {
            const imageIds = images.map(file => file._id);
            return Product.build({
                name: product.name,
                details: product.details,
                cost: product.cost,
                images: imageIds
            } as IProduct).save();
        });
    }

    async getProductImage(imageId: string): Promise<{ readable: Readable, file: IFile }> {
        const file = await fsService.findFileById(imageId);
        const readable = fsService.downloadFile(file._id);
        return { readable, file };
    }
    private deleteProductImage(imageId: string, product: IProduct) {
        if (product.images.includes(imageId)) {
            fsService.deleteFile(imageId);
            product.images = product.images.filter(id => id !== imageId);
        }
    }

    async updateProduct(req: ProductUpdateRequest): Promise<IProduct> {
        const product = await this.getProductById(req.id);
        let imagePromises: Promise<IFile>[] = [];
        if (req.deleteImages) {
            const deleteImageId = req.deleteImages.split(",");
            deleteImageId.map((id) => (
                this.deleteProductImage(id, product))
            );
        }
        if (req.images && req.images.length > 0) {
            imagePromises = req.images.map((image) => fsService.save(image));
        }
        return Promise.all(imagePromises).then(images => {
            const imageIds = images.map(file => file._id);
            if (req.name) {
                product.name = req.name;
            }
            if (req.details) {
                product.details = req.details;
            }
            if (req.cost) {
                product.cost = req.cost;
            }
            if (req.images) {
                product.images = [...product.images, ...imageIds];
            }
            return product.save();
        });
    }

}