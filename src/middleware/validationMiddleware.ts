import { oneOf, query,  validationResult } from 'express-validator';
import {
    BadRequestError,
} from '../errors/customErrors';
import { NextFunction, Request, Response } from 'express';

export const validateFeelLikeQueryParams = [
    query('orderBy').exists().withMessage('must define orderBy'),
    oneOf([query('orderBy').equals('asc'), query('orderBy').equals('desc')], {message: 'orderBy can only be asc or desc'}),
    (req: Request, _: Response, next: NextFunction) => {
        console.log('inside validator');

        const errors = validationResult(req);
        console.log('elad', errors);

        if (!errors.isEmpty()) {
            const errorMessages: string[] = errors
                .array()
                .map((error) => error.msg);
            throw new BadRequestError(errorMessages[0] ?? '');
        }
        return next();
    },
];
