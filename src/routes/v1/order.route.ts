import express, { Router } from "express";
import { AccessControl as ac } from "../../config/access-controll.config";
import { OrderController } from "../../controllers/index.controller";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { pageValidation } from "../../models/plugins/paginate.plugin";
import { OrderValidators } from "../../payload/validations/index.validations";
import { Route } from "../Route";

export class OrderRoute implements Route {

    constructor(
        readonly path: string = "/orders",
        readonly router: Router = express.Router()
    ) {
        const orders = ac.actions.ORDERS;
        const admin = ac.actions.ADMIN;
        const read = ac.permissions.READ;
        const update = ac.permissions.UPDATE;

        this.router.get("/user", isAuthorized(orders, read), validate(pageValidation), OrderController.getUsersOrderHistory);
        this.router.get("/user/:id", isAuthorized(orders, read), OrderController.getUserOrdersById);

        this.router.get("/admin", isAuthorized(admin, read), validate(pageValidation), OrderController.getAllOrders);
        this.router.get("/admin/:id", isAuthorized(admin, read), OrderController.getOrdersById);
        this.router.post("/admin", isAuthorized(admin, update), validate(OrderValidators.orderOverviewRequest), OrderController.updateOverview);
    }

}