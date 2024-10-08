import { Request, Response } from 'express';
import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../data-source';
import { Forcast } from '../entity/Forcast';
import memoizee = require('memoizee');
import { lastFeelLikeQuery } from '../utils/sql-queries'

const MEMOIZE_MAX_AGE = 1000 * 60 * 5;
const MEMOIZE_CACHE_SIZE = 100;

export const getAverageTemp = async (_1: Request, res: Response) => {
    const result = await getAverageTempMemoized();

    res.status(StatusCodes.OK).json({ averages: result });
};

export const getGlobalLowestHumidity = async (_1: Request, res: Response) => {
    const result = await getLowestHumidityMemoized();

    res.status(StatusCodes.OK).json(result);
};

export const getLastFeelLikeRanked = async (req: Request, res: Response) => {
    let orderBy = req.query?.['orderBy'] ?? 'ASC';
    orderBy = (orderBy as string).toUpperCase();

    const result = await getLastFeelLikeMemoized(orderBy);

    res.status(StatusCodes.OK).json(result);
};


const getLastFeelLikeMemoized = memoizee(getLastFeelLikeQuery, {
    promise: true,
    max: MEMOIZE_CACHE_SIZE,
    maxAge: MEMOIZE_MAX_AGE,
});

async function getLastFeelLikeQuery(orderBy: string) {
    return await AppDataSource.query(lastFeelLikeQuery(orderBy));
}

const getLowestHumidityMemoized = memoizee(getLowestHumidityQuery, {
    promise: true,
    max: MEMOIZE_CACHE_SIZE,
    maxAge: MEMOIZE_MAX_AGE,
});

async function getLowestHumidityQuery() {
    const forcastRepository = AppDataSource.getRepository(Forcast);

    const result = await forcastRepository
        .createQueryBuilder('forcast')
        .innerJoinAndSelect('forcast.location', 'location')
        .select('location.name', 'name')
        .addSelect('forcast.ts', 'time')
        .addSelect('forcast.humidity', 'humidity')
        .orderBy('forcast.humidity', 'ASC')
        .limit(1)
        .getRawOne();
    return result;
}

const getAverageTempMemoized = memoizee(getAverageTempQuery, {
    promise: true,
    max: MEMOIZE_CACHE_SIZE,
    maxAge: MEMOIZE_MAX_AGE,
});

async function getAverageTempQuery() {

    const forcastRepository = AppDataSource.getRepository(Forcast);

    const result = await forcastRepository
        .createQueryBuilder('forcast')
        .innerJoinAndSelect('forcast.location', 'location')
        .select('location.name', 'name')
        .addSelect('forcast.ts::date', 'day')
        .addSelect('AVG(forcast.temp)', 'average_temp')
        .groupBy('location.name')
        .addGroupBy('day')
        .orderBy('location.name', 'ASC')
        .addOrderBy('day', 'ASC')
        .getRawMany();
    return result;
}
