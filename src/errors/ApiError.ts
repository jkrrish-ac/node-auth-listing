export class ApiError extends Error {

    constructor(
        readonly statusCode: number,
        readonly message: string
    ) {
        super(message);
    }

}