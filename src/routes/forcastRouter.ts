import { Router } from 'express';
import {
    getAverageTemp,
    getGlobalLowestHumidity,
    getLastFeelLikeRanked,
} from '../controllers/forcastController';
import { validateFeelLikeQueryParams } from '../middleware/validationMiddleware';

const router = Router();

router.route('/average-temp').get(getAverageTemp);

router.route('/lowest-humidity').get(getGlobalLowestHumidity);

router
    .route('/last-feel-like-ranked')
    .get(validateFeelLikeQueryParams, getLastFeelLikeRanked);

export default router;
