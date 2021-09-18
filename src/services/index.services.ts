import { AuthService } from "./auth/auth.service";
import { DefaultAuhService } from "./auth/default-auth.service";
import { CartService } from "./cart/cart.service";
import { DefaultCartService } from "./cart/default-cart.service";
import { FileStorageService } from "./fileStorage/file-storage.service";
import { GridFsStorageService } from "./fileStorage/gridfs-storage.service";
import { DefaultOrderService } from "./order/default-order.service";
import { OrderService } from "./order/order.service";
import { DefaultProductService } from "./products/default-products.service";
import { ProductService } from "./products/product.service";
import { DefaultTokenService } from "./token/default-token.service";
import { TokenService } from "./token/token.service";
import { DefaultUserService } from "./user/default-user.service";
import { UserService } from "./user/user.service";

const tokenService: TokenService = new DefaultTokenService();
const userService: UserService = new DefaultUserService();
const authService: AuthService = new DefaultAuhService();
const fsService: FileStorageService = new GridFsStorageService();
const productService: ProductService = new DefaultProductService();
const orderService: OrderService = new DefaultOrderService();
const cartService: CartService = new DefaultCartService();

export {
    userService,
    authService,
    tokenService,
    fsService,
    productService,
    orderService,
    cartService
};
