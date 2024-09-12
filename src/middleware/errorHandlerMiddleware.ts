import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const errorHandlerMiddleware: ErrorRequestHandler = (err: any, _1: Request, res: Response, _2: NextFunction) => {
    const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    const msg = err.message || 'something went wrong, try again later';
    res.status(statusCode).json({ msg });
};

export default errorHandlerMiddleware;
