import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import constants from "../constants";
import { PaginateOptions } from "../models/plugins/paginate.plugin";
import { IProductSearch } from "../models/product.model";
import { ApiResponse } from "../payload/ApiResponse";
import { ProductRequest, ProductResponse, ProductUpdateRequest } from "../payload/products.payload";
import { productService } from "../services/index.services";

export const getProducts = (req: Request, res: Response, next: NextFunction) => {
    productService.getProducts(
        new IProductSearch(req.query.name as string, req.query.details as string),
        PaginateOptions.create(req.query)
    ).then(page => {
        ApiResponse.send(res, httpStatus.OK, {
            message: constants.messages.PRODUCTS_FOUND,
            success: true,
            data: [page]
        });
    }).catch(error => next(error));
};
export const getProductById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    productService.getProductById(id)
        .then(product => ApiResponse.send(res, httpStatus.OK, {
            success: true,
            message: constants.messages.PRODUCTS_FOUND,
            data: [ProductResponse.create(product)]
        }))
        .catch(err => next(err));
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
    req.body.images = req.files ? req.files : [req.file];
    productService.addProduct(
        req.body as ProductRequest
    ).then(product => {
        ApiResponse.send(res, httpStatus.CREATED, {
            message: constants.messages.PRODUCTS_CREATED,
            success: true,
            data: [
                ProductResponse.create(product)
            ]
        });
    }).catch(error => next(error));
};

export const getProductImage = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    productService.getProductImage(id)
        .then(value => {
            res.contentType(value.file.contentType);
            value.readable.pipe(res);
        }).catch(err => next(err));
};
export const updateProduct = (req: Request, res: Response, next: NextFunction) => {
    req.body.images = req.files ? req.files : [req.file];
    productService.updateProduct(req.body as ProductUpdateRequest)
        .then(product => ApiResponse.send(res, httpStatus.OK, {
            success: true,
            message: constants.messages.PRODUCT_UPDATED,
            data: [
                ProductResponse.create(product)
            ]
        }
        ))
        .catch(err => next(err));
};