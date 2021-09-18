import { IOrder } from "../../models/order.model";
import { ICart } from "../../models/subdocs/cart.subdoc";
import { CartRequest } from "../../payload/cart.payload";

export interface CartService {
    getCart(userId: string): Promise<ICart>;
    addToCart(req: CartRequest): Promise<ICart>;
    orderNow(req: CartRequest): Promise<IOrder>;
    removeFromCart(userId: string, productId: string): Promise<ICart>;

    getTotalAmount(cart: ICart): Promise<number>;
}