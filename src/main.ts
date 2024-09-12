import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware';

import forCastRouter from './routes/forcastRouter';
import geolocationRouter from './routes/geolocationRouter';
import './data-source'

const app = express();

app.use(express.json());

const PORT: string | number = process.env['PORT'] || 3000;

app.use('/api/v1/forcast', forCastRouter);
app.use('/api/v1/geolocation', geolocationRouter);

app.use('*', (_, res) => {
    res.status(404).json({ msg: 'not found' });
});

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
