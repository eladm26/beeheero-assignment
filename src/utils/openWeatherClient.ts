import axios from "axios";

export const forcastClient = axios.create({
    baseURL: 'https://api.openweathermap.org/data'
})

export const geoLocationClient = axios.create({
    baseURL: 'https://api.openweathermap.org/geo'
})