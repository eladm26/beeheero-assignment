import { Router } from 'express';
import {
    getAverageTemp,
    getGlobalLowestHumidity,
    getLastFeelLikeRanked,
} from '../controllers/forcastController';
import { validateFeelLikeQueryParams } from '../middleware/validationMiddleware';
import rateLimiter from 'express-rate-limit';

const router = Router();

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: {msg: 'IP rate limit exceeded, retry in 15 min'}
});

router.route('/average-temp').get(apiLimiter, getAverageTemp);

router.route('/lowest-humidity').get(apiLimiter, getGlobalLowestHumidity);

router
    .route('/last-feel-like-ranked')
    .get(apiLimiter, validateFeelLikeQueryParams, getLastFeelLikeRanked);

export default router;
