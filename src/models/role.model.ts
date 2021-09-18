import assert from "assert";
import bcrypt from "bcrypt";
import { AccessControl } from "../config/access-controll.config";
import { userActions, userPermissions } from "../config/role.config";
import constants from "../constants";


const permissions = [...userPermissions, constants.ALL] as const;
const actions = [...userActions, constants.ALL] as const;

export type RoleType = keyof typeof AccessControl.roles;
export type Permission = typeof permissions[number];
export type Actions = typeof actions[number];

export interface IRole {
    name: string;
    actions: { [key in Actions]?: Permission[] };
}

export default abstract class Role {

    static permissions() {
        return permissions;
    }

    static actions() {
        return actions;
    }

    static getRole(role: string) {
        const key = Object.keys(AccessControl.roles).find((uRole) => bcrypt.compareSync(uRole, role));
        return AccessControl.roles[key as RoleType];
    }

    static hasAction(role: IRole, action: Actions): boolean {
        const roleActions = role.actions;
        return !!(roleActions && roleActions[action]);
    }

    static hasPermission(role: IRole, action: Actions, permission: Permission): boolean {
        if (this.hasAction(role, action)) {
            const roleAction = role.actions[action];
            assert.strict(roleAction);
            return roleAction.includes(permission);
        }
        return false;
    }
}