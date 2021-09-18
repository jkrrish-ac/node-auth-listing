import express, { Router } from "express";
import { AccessControl as ac } from "../../config/access-controll.config";
import { CartController } from "../../controllers/index.controller";
import { isAuthorized } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { CartValidators } from "../../payload/validations/index.validations";
import { Route } from "../Route";

export class CartRoute implements Route {

    constructor(
        readonly path: string = "/cart",
        readonly router: Router = express.Router()
    ) {

        const cart = ac.actions.CART;

        router.get("/", isAuthorized(cart, ac.permissions.READ), CartController.getCart);
        router.post("/", isAuthorized(cart, ac.permissions.UPDATE), validate(CartValidators.cartRequest), CartController.addToCart);
        router.post("/order", isAuthorized(cart, ac.permissions.UPDATE), validate(CartValidators.cartRequest), CartController.orderNow);
        router.delete("/:id", isAuthorized(cart, ac.permissions.DELETE), CartController.removeFromCart);
    }

}