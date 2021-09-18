import mongoose from "mongoose";
import config from "./config";

export const db = {
    connect() {
        return mongoose.connect(config.db.url, config.db.options);
    }
};