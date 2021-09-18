import express, { Request, Router } from "express";
import httpStatus from "http-status";
import multer, { FileFilterCallback } from "multer";
import { AccessControl as ac } from "../../config/access-controll.config";
import config from "../../config/config";
import constants from "../../constants";
import { ProductController } from "../../controllers/index.controller";
import { ApiError } from "../../errors/ApiError";
import { hasAccess, isAuthorized } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { pageValidation } from "../../models/plugins/paginate.plugin";
import { ProductValidators } from "../../payload/validations/index.validations";
import { Route } from "../Route";

export class ProductRoute implements Route {
    constructor(
        readonly path: string = "/products",
        readonly router: Router = express.Router()
    ) {

        const product = ac.actions.PRODUCTS;

        const upload = multer({
            fileFilter: this.fileFilter
        });

        router.get("/", validate(pageValidation), ProductController.getProducts);
        router.post(
            "/", isAuthorized(), hasAccess(product, ac.permissions.WRITE),
            upload.array(constants.PRODUCTS_IMAGE_FIELD_NAME),
            validate(ProductValidators.productRequest), ProductController.createProduct
        );
        router.get("/images/:id", ProductController.getProductImage);
        router.get("/:id", ProductController.getProductById);
        router.post("/update", isAuthorized(), hasAccess(product, ac.permissions.UPDATE),
            upload.array(constants.PRODUCTS_IMAGE_FIELD_NAME),
            validate(ProductValidators.update), ProductController.updateProduct);
    }

    fileFilter(req: Request, file: Express.Multer.File, callback: FileFilterCallback) {
        if (config.supportedImagetypes.test(file.mimetype)) {
            callback(null, true);
            return;
        }
        callback(new ApiError(httpStatus.BAD_REQUEST, `file type ${file.mimetype} not supported`));
    }
}