import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import constants from "../constants";
import { IOrder } from "../models/order.model";
import { ICart } from "../models/subdocs/cart.subdoc";
import { IProductDetails } from "../models/subdocs/product-details.subdoc";
import { ApiResponse } from "../payload/ApiResponse";
import { CartResponse } from "../payload/cart.payload";
import { OrderResponse } from "../payload/order.payload";
import { cartService } from "../services/index.services";
import { ApiUtils } from "../utils/ApiUtils";

export const getCart = (req: Request, res: Response, next: NextFunction) => {
    cartService.getCart(ApiUtils.getCurrentUserId(req))
        .then(cart => sendCartResponse(res, cart, constants.messages.CART_FOUND))
        .catch(err => next(err));
};

export const addToCart = (req: Request, res: Response, next: NextFunction) => {
    cartService.addToCart({ userId: ApiUtils.getCurrentUserId(req), products: req.body.products as IProductDetails[] })
        .then(cart => sendCartResponse(res, cart, constants.messages.CART_UPDATED))
        .catch(err => next(err));
};

export const orderNow = (req: Request, res: Response, next: NextFunction) => {
    cartService.orderNow({ userId: ApiUtils.getCurrentUserId(req), products: req.body.products as IProductDetails[] })
        .then(order => sendOrderResponse(res, order))
        .catch(err => next(err));
};

export const removeFromCart = (req: Request, res: Response, next: NextFunction) => {
    cartService.removeFromCart(ApiUtils.getCurrentUserId(req), req.params.id)
        .then(cart => sendCartResponse(res, cart, constants.messages.CART_UPDATED))
        .catch(err => next(err));
};

async function sendCartResponse(res: Response, cart: ICart, message: string) {
    ApiResponse.send(res, httpStatus.OK, {
        message,
        success: true,
        data: [await CartResponse.create(cart)]
    });
}

async function sendOrderResponse(res: Response, order: IOrder) {
    ApiResponse.send(res, httpStatus.OK, {
        message: constants.messages.ORDER_CREATED,
        success: true,
        data: [await OrderResponse.create(order)]
    });
}