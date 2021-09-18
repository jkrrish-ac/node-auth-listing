import express, { Router } from "express";
import { AuthController } from "../../controllers/index.controller";
import { validate } from "../../middlewares/validate.middleware";
import { AuthValidators } from "../../payload/validations/index.validations";
import { Route } from "../Route";

export class AuthRoute implements Route {

    constructor(
        readonly path: string = "/auth",
        readonly router: Router = express.Router()
    ) {

        this.router.post("/register", validate(AuthValidators.registration), AuthController.registerUser);
        this.router.post("/login", validate(AuthValidators.login), AuthController.login);
        this.router.post("/validate", AuthController.validateToken);

    }

}