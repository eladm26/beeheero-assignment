import { Router } from 'express';
import {
    getAverageTemp,
    getGlobalLowestHumidity,
} from '../controllers/forcastController';
const router = Router();

router.route('/average-temp').get(getAverageTemp);

router.route('/lowest-humidity').get(getGlobalLowestHumidity);

export default router;
