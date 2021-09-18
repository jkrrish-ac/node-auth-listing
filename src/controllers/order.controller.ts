import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import constants from "../constants";
import { IOrder, IOrderSearch } from "../models/order.model";
import { PaginateOptions } from "../models/plugins/paginate.plugin";
import { ApiPageResponse } from "../payload/ApiPageResponse";
import { ApiResponse } from "../payload/ApiResponse";
import { OrderOverviewRequest, OrderResponse, UserOrderGetRequest } from "../payload/order.payload";
import { orderService } from "../services/index.services";
import { ApiUtils } from "../utils/ApiUtils";

// admin resource
export const getOrdersById = (req: Request, res: Response, next: NextFunction) => {
    orderService.getOrderById(req.params.id)
        .then(order => sendOrderResponse(res, order, constants.messages.ORDERS_FOUND))
        .catch(err => next(err));
};

export const getUserOrdersById = (req: Request, res: Response, next: NextFunction) => {
    const userId = ApiUtils.getCurrentUserId(req);
    const orderId = req.params.id;
    orderService.getUsersOrderById({ userId, orderId } as UserOrderGetRequest)
        .then(order => sendOrderResponse(res, order, constants.messages.ORDERS_FOUND))
        .catch(err => next(err));
};

export const getUsersOrderHistory = (req: Request, res: Response, next: NextFunction) => {
    const userId = ApiUtils.getCurrentUserId(req);
    orderService.getOrderHistory(new IOrderSearch(userId), PaginateOptions.create(req.query))
        .then(page => sendOrderPageResponse(res, page))
        .catch(err => next(err));
};

// admin resource
export const getAllOrders = (req: Request, res: Response, next: NextFunction) => {
    orderService.getOrderHistory(new IOrderSearch(), PaginateOptions.create(req.query))
        .then(page => sendOrderPageResponse(res, page))
        .catch(err => next(err));
};

// admin resource
export const updateOverview = (req: Request, res: Response, next: NextFunction) => {
    orderService.updateOrderOverview(req.body as OrderOverviewRequest)
        .then(order => sendOrderResponse(res, order, constants.messages.ORDER_UPDATED))
        .catch(err => next(err));
};

async function sendOrderResponse(res: Response, order: IOrder, message: string) {
    ApiResponse.send(res, httpStatus.OK, {
        success: true,
        message,
        data: [await OrderResponse.create(order)]
    });
}

async function sendOrderPageResponse(res: Response, page: ApiPageResponse) {
    page.data = await Promise.all(page.data);
    ApiResponse.send(res, httpStatus.OK, {
        success: true,
        message: constants.messages.ORDERS_FOUND,
        data: [page]
    });
}