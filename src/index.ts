import http from "http";
import httpStatus from "http-status";
import app from "./app";
import config from "./config/config";
import { db } from "./config/db.config";
import log from "./config/logger.config";
import { ApiError } from "./errors/ApiError";

db.connect()
    .then(val => {
        const server = http.createServer(app);
        server.listen(config.port, () => log.info("server started at port %d", config.port));
    })
    .catch(err => {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
    });
