import { Router } from 'express';
import { getLocations } from '../controllers/geolocationController';
const router = Router();

router
    .route('/')
    .get((getLocations))

export default router;
