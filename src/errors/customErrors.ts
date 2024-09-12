import { StatusCodes } from 'http-status-codes';

export class HTTPError extends Error {
    statusCode: StatusCodes;

    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class NotFoundError extends HTTPError {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

export class BadRequestError extends HTTPError {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestError';
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}
export class UnauthenticatedError extends HTTPError {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthenticatedError';
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}
export class UnauthorizedError extends HTTPError {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedError';
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
