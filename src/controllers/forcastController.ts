import { Request, Response } from 'express';
import 'express-async-errors';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../data-source';
import { Forcast } from '../entity/Forcast';

export const getAverageTemp = async (_1: Request, res: Response) => {
    const forcasrRepository = AppDataSource.getRepository(Forcast);

    const result = await forcasrRepository
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

    console.log(result);

    res.status(StatusCodes.OK).json({averages: result});

};
