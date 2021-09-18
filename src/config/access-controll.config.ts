import Role, { Actions, Permission } from "../models/role.model";
import log from "./logger.config";
import { userRoles } from "./role.config";

export abstract class AccessControl {
    public static readonly permissions = AccessControl.createPermissionObject();
    public static readonly actions = AccessControl.createActionsObject();
    public static readonly roles = userRoles;

    private static createPermissionObject() {
        log.info("setting up permissions");
        return Role.permissions().reduce((obj, permission) => {
            obj[permission] = permission as never;
            return obj;
        }, {} as { [key in Permission]: Extract<Permission, key> });
    }

    private static createActionsObject() {
        log.info("setting up actions");
        return Role.actions().reduce((obj, action) => {
            obj[action] = action as never;
            return obj;
        }, {} as { [key in Actions]: Extract<Actions, key> });
    }
}

