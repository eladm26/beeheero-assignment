import { Router } from 'express';
import { getAverageTemp } from '../controllers/forcastController';
const router = Router();

router
    .route('/average-temp')
    .get(getAverageTemp)

export default router;
