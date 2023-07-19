import { useEffect, useState } from "react";
import "./App.css";

interface Coordinates {
    lat: number;
    lon: number;
}

interface WeatherData {
    id: number;
    main: string;
    description: string;
    icon: string;
}

interface CurrentData {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    wind_gust: number;
    weather: WeatherData[];
}

interface MinuteData {
    dt: number;
    precipitation: number;
}

interface HourData extends CurrentData {
    pop: number;
    rain: {
        [key: string]: number;
    };
}

interface TempData {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
}

interface FeelsLike {
    day: number;
    night: number;
    eve: number;
    morn: number;
}

interface DailyData extends Omit<CurrentData, "temp" | "feels_like"> {
    moonrise: number;
    moonset: number;
    moon_phase: number;
    summary: string;
    temp: TempData;
    feels_like: FeelsLike;
    pop: number;
    rain: number;
}

interface ForceCastData {
    lat: number;
    lon: number;
    timezone: string;
    timezone_offset: number;
    current: CurrentData;
    minutely: MinuteData[];
    hourly: HourData[];
    daily: DailyData[];
}

interface City extends Coordinates {
    name: string;
    local_names: {
        [key: string]: string;
    };
    country: string;
}

function App() {
    const [city, setCity] = useState<City | null>(null);
    const [forceCastData, setForceCastData] = useState<ForceCastData | null>(
        null
    );

    const fetchForceCastData = async (coordinates: Coordinates) => {
        const url = new URL("https://api.openweathermap.org/data/3.0/onecall");
        url.searchParams.append("lat", coordinates.lat.toString());
        url.searchParams.append("lon", coordinates.lon.toString());
        url.searchParams.append("appid", import.meta.env.VITE_APPID);
        url.searchParams.append("units", "metric");
        url.searchParams.append("lang", "vi");

        const res = await fetch(url);
        const data: ForceCastData = (await res.json()) as ForceCastData;
        setForceCastData(data);
    };

    const fetchCityData = async (coordinates: Coordinates) => {
        const url = new URL("http://api.openweathermap.org/geo/1.0/reverse");
        url.searchParams.append("lat", coordinates.lat.toString());
        url.searchParams.append("lon", coordinates.lon.toString());
        url.searchParams.append("appid", import.meta.env.VITE_APPID);
        url.searchParams.append("limit", "1");

        const res = await fetch(url);
        const data: City[] = (await res.json()) as City[];
        setCity(data[0]);
    };

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coordinates = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                };

                fetchForceCastData(coordinates).catch((error) =>
                    console.error(error)
                );

                fetchCityData(coordinates).catch((error) =>
                    console.error(error)
                );
            });
        }
    }, []);

    console.log(forceCastData);
    console.log(city);

    return (
        <>
            <h1>Lat: {city?.lat}</h1>
            <h1>Lon: {city?.lon}</h1>
        </>
    );
}

export default App;
