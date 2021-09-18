import express, { Router } from "express";
import { UserController } from "../../controllers/index.controller";
import { isAuthorized, hasAccess } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { UserValidators } from "../../payload/validations/index.validations";
import { Route } from "../Route";
import { AccessControl as ac } from "../../config/access-controll.config";

export class UserRoute implements Route {

    constructor(
        readonly path: string = "/users",
        readonly router: Router = express.Router()
    ) {
        const users = ac.actions.USERS;
        router.get("/me", isAuthorized(), hasAccess(users, ac.permissions.READ), UserController.getLoggedInUser);
        router.post("/update", isAuthorized(), hasAccess(users, ac.permissions.UPDATE), validate(UserValidators.update), UserController.updateUser);
    }

}