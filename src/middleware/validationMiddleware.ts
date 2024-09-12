import { param, ValidationChain, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors/customErrors';
import { NextFunction, Request, Response } from 'express';


const withValidationErrors = (validateValues: ValidationChain[]) => {
    return [
        validateValues,
        (req: Request, _: Response, next: NextFunction) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessages: string[] = errors.array().map((error) => error.msg);
                if (errorMessages[0]?.startsWith('no job')) {
                    throw new NotFoundError(errorMessages[0]);
                }
                if (errorMessages[0]?.startsWith('not authorized')) {
                    throw new UnauthorizedError(errorMessages[0]);
                }
                console.log(errorMessages);
                throw new BadRequestError(errorMessages[0] ?? '');
            }
            next();
        },
    ];
};


export const validateIdParam = withValidationErrors([
    param('id').exists()
]);