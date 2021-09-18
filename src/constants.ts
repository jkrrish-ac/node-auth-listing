const constants = {

    DEFAULT_PORT: 3000,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_HASH_ROUNDS: 10,
    PASSWORD_VALIDATION_REG_EXP: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#\$%\^&\*\(\)\-_+=|\\\[\]\{\};:'",<\.>\?\/]).*/,
    ROLE_HASH_ROUNDS: 5,
    DEFAULT_TOKEN_EXPIRY: "1d",
    LOGGER_LEVEL: "debug",
    LOGGER_TIME_STAMP_FORMAT: "YYYY-MM-DD HH:mm:ss",
    LOGGER_LABEL: "node_auth_server",
    SUPPORTED_IMAGE_TYPES: /image\/jpeg|image\/png/,

    DEFAULT_PAGINATION_PAGE_SIZE: 10,
    DEFAULT_PAGINATION_PAGE_NO: 1,

    DEFAULT_FILE_STORAGE_BUCKET_NAME: "uploads",
    PRODUCTS_IMAGE_FIELD_NAME: "images",

    ROLE_USER: "ROLE_USER",
    ROLE_ADMIN: "ROLE_ADMIN",

    PRODUCTS: "PRODUCTS" as const,
    USERS: "USERS" as const,
    ORDERS: "ORDERS" as const,
    ADMIN: "ADMIN" as const,
    CART: "CART" as const,

    READ: "READ" as const,
    WRITE: "WRITE" as const,
    UPDATE: "UPDATE" as const,
    DELETE: "DELETE" as const,
    ALL: "ALL" as const,

    models: {
        PRODUCT: "Product",
        USER: "User",
        ORDER: "Order"
    },

    messages: {
        DATA_BASE_URL_NOT_SET: "Database Url not set",
        TOKEN_SECRET_NOT_SET: "Token Secret not set",

        TOKEN_VALID: "Token valid",
        TOKEN_INVALID: "Token invalid",
        USER_REGISTERED: "User Registered",
        LOGIN_SUCCESS: "Login successfull",

        AUTHENTICATION_FAILED: "Authentication failed",
        AUTH_TOKEN_NOT_VALID: "Auth token not valid",
        AUTHORIZATION_FAILED: "Authorization failed",

        USER_FOUND: "User Found",
        USER_NOT_FOUND: "User Not Found",
        USER_UPDATED: "User updated",
        USER_ID_IS_REQUIRED: "user id is required",

        INVALID_EMAIL: "Invalid Email",
        INVALID_PASSWORD_CONTENT: "password should contain atleast one small, capital letters, special charachers and numbers",
        INVALID_PASSWORD_LENGTH: "password length should be atleast 8",

        NOT_FOUND: "Not Found",

        PRODUCTS_FOUND: "Products Found",
        PRODUCT_NOT_FOUND: "Product not found",
        PRODUCTS_CREATED: "Products Created",
        PRODUCT_UPDATED: "Product updated",
        PRODUCT_ALREADY_EXISTS: "product already exists",
        PRODUCT_ID_REQUIRED: "product id required",

        INTERNAL_SERVER_ERROR: "Internal Server Error",

        EMAIL_USERNAME_ALREADY_TAKEN: "Email/username already taken",

        COST_SHOULD_BE_A_NUMBER: "cost should be a number",
        COST_SHOULD_BE_POSITIVE: "cost should be positive",

        UNDEFINED_FILE_CANNOT_BE_SAVED: "undefined file cannot be saved",
        FILE_NOT_FOUND: "file not found",
        FAILED_TO_DELETE_FILE: "failed to delete file",
        DATA_BASE_CONNECTION_NOT_ESTABLISHED: "database connection not established",

        QUANTITY_SHOULD_BE_POSITVE: "quantity should be positive",

        ORDER_NOT_FOUND: "Order not found",
        ORDER_FOUND: "Order found",
        ORDERS_FOUND: "Orders found",
        ORDER_UPDATED: "Order updated",
        ORDER_ID_IS_REQUIRED: "Order Id is required",
        ORDER_CREATED: "Order created",

        CANT_ADD_NOTHING_TO_CART: "Cant Add nothing to cart",
        EMPTY_CART: "Cart is empty",
        CART_FOUND: "Cart found",
        CART_UPDATED: "Cart udpated"
    },

    seperators: {
        SPACE: " ",
        COMMA_SPACE: ", ",
        COMMA: ",",
        COLON: ":",
        EMPTY: ""
    }

};

export default constants;