import { Response } from "express";

export class ApiResponse {
    readonly message?: string;
    readonly success?: boolean;
    readonly data?: any[];

    constructor(data: Partial<ApiResponse>) {
        Object.assign(this, data);
    }

    static send(res: Response, status: number, data: Partial<ApiResponse>) {
        res.status(status).json(new ApiResponse(data));
    }
}