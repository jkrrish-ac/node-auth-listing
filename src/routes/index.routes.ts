import express from "express";
import constants from "../constants";
import { ApiError } from "../errors/ApiError";
import { Route } from "./Route";
import { AuthRoute } from "./v1/auth.route";
import { CartRoute } from "./v1/cart.route";
import { OrderRoute } from "./v1/order.route";
import { ProductRoute } from "./v1/products.route";
import { UserRoute } from "./v1/user.route";


const router = express.Router();
const routes: Route[] = [
    new AuthRoute(),
    new UserRoute(),
    new ProductRoute(),
    new OrderRoute(),
    new CartRoute()
];

routes.forEach(route => router.use(route.path, route.router));

router.use((req, res, next) => next(new ApiError(404, constants.messages.NOT_FOUND)));

export default router;