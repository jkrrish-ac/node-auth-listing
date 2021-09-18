import c from "../constants";
import { IRole } from "../models/role.model";

export const userActions = [
    c.PRODUCTS, c.USERS, c.ORDERS, c.ADMIN, c.CART
] as const;
export const userPermissions = [c.READ, c.WRITE, c.UPDATE, c.DELETE] as const;

export const userRoles = {
    ROLE_ADMIN: {
        name: c.ROLE_ADMIN,
        actions: {
            ALL: [c.ALL]
        }
    } as IRole,

    ROLE_USER: {
        name: c.ROLE_USER,
        actions: {
            PRODUCTS: [c.READ],
            USERS: [c.READ, c.UPDATE],
            ORDERS: [c.READ],
            CART: [c.READ, c.UPDATE, c.DELETE]
        }
    } as IRole
} as const;