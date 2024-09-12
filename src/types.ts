export type GeoLocation = {
    name: string;
    local_names: { [lang: string]: string };
    lat: number;
    lon: number;
    country: string;
    state: string;
};

type TempParams = {
    temp: number;
    humidity: number;
    feels_like: number;
};

type DailyForcast = {
    dt_txt: string
    main: TempParams
}

export type WeatherAPIForcast = {
    list: DailyForcast[]
}