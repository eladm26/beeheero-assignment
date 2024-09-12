import { Request, Response } from 'express';
import 'express-async-errors';
import { geoLocationClient } from '../utils/openWeatherClient';
import { StatusCodes } from 'http-status-codes';
import { AppDataSource } from '../data-source';
import { Location } from '../entity/Locations';
import { GeoLocation } from '../types';


export const getLocations = async (_1: Request, res: Response) => {
    // TODO: add locations to params + validation

    const locationRepository = AppDataSource.getRepository(Location);

    const locations = ['Jerusalem', 'Tel-Aviv', 'Eilat', 'Tiberias'];

    const promises = locations.map((locationName) => {
        const url = `/1.0/direct?q=${locationName}&appid=${process.env['OPEN_WEATHER_KEY']}`;

        return geoLocationClient.get<GeoLocation[]>(url);
    });

    const locationsInfo = await Promise.all(promises);

    const coordinates: { [loc: string]: [long: number, lat: number] } = {};
    locationsInfo.forEach((location) => {
        if (location.data[0]) {
            coordinates[location.data[0].name] = [
                location.data[0].lon,
                location.data[0].lat,
            ];
        }
    });

    const savePromises: Promise<Location>[] = [];

    for (const locationName in coordinates) {
        const user = locationRepository.create({
            name: locationName,
            lon: coordinates[locationName]![0],
            lat: coordinates[locationName]![1],
        });
        try {
            savePromises.push(locationRepository.save(user));
            await Promise.all(savePromises);
        } catch (err: unknown) {
            throw(err);
        }
    }

    res.status(StatusCodes.CREATED).json({
        locations: coordinates,
    });
};
