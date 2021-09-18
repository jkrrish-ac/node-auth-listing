import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            decoded_token: null | { [key: string]: any };
        }
    }
}