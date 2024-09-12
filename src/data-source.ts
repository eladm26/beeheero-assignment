import { DataSource } from 'typeorm';
import { Location } from './entity/Locations';
import { forcastClient, geoLocationClient } from './utils/openWeatherClient';
import { GeoLocation, WeatherAPIForcast } from './types';
import { Forcast } from './entity/Forcast';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'postgresdb',
    port: parseInt(process.env['POSTGRESDB_DOCKER_PORT'] ?? '5433'),
    username: process.env['POSTGRESDB_USER'] ?? 'test',
    password: process.env['POSTGRESDB_ROOT_PASSWORD'] ?? 'test',
    database: process.env['POSTGRESDB_DATABASE'] ?? 'test',
    synchronize: true,
    logging: true,
    entities: [Location, Forcast],
    subscribers: [],
    migrations: [],
});

AppDataSource.initialize()
    .then(async () => {
        await initializeLocations();
        const locationRepository = AppDataSource.getRepository(Location);
        const locations = await locationRepository.find();
        locations.map(loc => initializeSingleLocationForcast(loc));
    })
    .catch((error) => console.log(error));

async function initializeLocations() {
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
        savePromises.push(locationRepository.save(user));
    }
    try {
        await Promise.all(savePromises);
    } catch (error) {
        console.warn('locations already initialized');
    }
}

async function initializeSingleLocationForcast(location: Location) {
    const forcastsRepository = AppDataSource.getRepository(Forcast);

    const url = `/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${process.env['OPEN_WEATHER_KEY']}&units=metric`;
    const forcast = await forcastClient.get<WeatherAPIForcast>(url);
    const locationForcasts = forcast.data.list.map((forcast) =>
        forcastsRepository.create({
            humidity: forcast.main.humidity,
            temp: forcast.main.temp,
            feels_like: forcast.main.feels_like,
            ts: new Date(`${forcast.dt_txt} GMT`),
            location,
        })
    );

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        await queryRunner.manager.save(locationForcasts);
        await queryRunner.commitTransaction();
    } catch (error) {
        await queryRunner.rollbackTransaction();
    }
}
