import httpStatus from "http-status";
import constants from "../../constants";
import { ApiError } from "../../errors/ApiError";
import { IOrder } from "../../models/order.model";
import { IProduct } from "../../models/product.model";
import { ICart } from "../../models/subdocs/cart.subdoc";
import { IProductDetails } from "../../models/subdocs/product-details.subdoc";
import { IUser } from "../../models/user.model";
import { CartRequest } from "../../payload/cart.payload";
import { OrderRequest } from "../../payload/order.payload";
import { orderService, productService, userService } from "../index.services";
import { CartService } from "./cart.service";

export class DefaultCartService implements CartService {

    async getCart(userId: string): Promise<ICart> {
        const user = await this.checkIfUserExists(userId);
        return user.cart;
    }

    async addToCart(req: CartRequest): Promise<ICart> {
        const user = await this.checkIfUserExists(req.userId);
        if (!user.cart) {
            user.cart = { products: [] as IProductDetails[] } as ICart;
        }
        const userCart = user.cart;
        if (req.products.length === 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.CANT_ADD_NOTHING_TO_CART);
        }
        for (const productDetails of req.products) {
            await this.checkIfProductExists(productDetails.productId);
            const existing = userCart.products.find(p => p.productId === productDetails.productId);
            if (existing) {
                existing.quantity += productDetails.quantity;
                continue;
            }
            userCart.products.push(productDetails);
        }
        return user.save().then(usr => usr.cart);
    }

    async orderNow(req: CartRequest): Promise<IOrder> {
        let user = await this.checkIfUserExists(req.userId);
        const cart = user.cart;
        if (!cart.products || cart.products.length === 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.EMPTY_CART);
        }

        const products = cart.products.map(productDetail => {
            const existing = req.products.find((val) => val.productId === productDetail.productId);
            if (existing) {
                productDetail.quantity = existing.quantity;
            }
            return productDetail;
        });

        cart.products = [];
        user = await user.save();
        return orderService.createOrder({ userId: user._id, products } as OrderRequest);
    }

    async removeFromCart(userId: string, productId: string): Promise<ICart> {
        const user = await this.checkIfUserExists(userId);
        await this.checkIfProductExists(productId);

        const cart = user.cart;
        if (cart && cart.products.length > 0) {
            const product = cart.products.find(productDetail => productDetail.productId === productId);
            if (product) {
                const index = cart.products.indexOf(product);
                if (index > -1) {
                    cart.products.splice(index, 1);
                    return user.save().then(usr => usr.cart);
                }
            }
        }
        throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.PRODUCT_NOT_FOUND);
    }

    async getTotalAmount(cart: ICart): Promise<number> {
        return cart.totalAmount();
    }


    private async checkIfUserExists(userId: string): Promise<IUser> {
        const user = await userService.getUser(userId);
        if (!user) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.USER_NOT_FOUND);
        }
        return user;
    }

    private async checkIfProductExists(productId: string): Promise<IProduct> {
        const product = await productService.getProductById(productId);
        if (!product) {
            throw new ApiError(httpStatus.BAD_REQUEST, constants.messages.PRODUCT_NOT_FOUND);
        }
        return product;
    }
}