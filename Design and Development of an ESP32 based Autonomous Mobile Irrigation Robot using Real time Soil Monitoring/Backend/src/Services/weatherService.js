const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export const getWeatherData = async (latitude, longitude) => {
    if (typeof latitude !== "number" || typeof longitude !== "number") {
        throw new Error("Valid latitude and longitude are required.");
    }

    if (!process.env.OPENWEATHER_API_KEY) {
        throw new Error("OPENWEATHER_API_KEY is not configured.");
    }

    const url = new URL(OPENWEATHER_API_URL);

    url.searchParams.set("lat", latitude);
    url.searchParams.set("lon", longitude);
    url.searchParams.set("appid",process.env.OPENWEATHER_API_KEY);

    const response = await fetch(url);

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error( `OpenWeather API error (${response.status}): ${errorText}` );
    }

    const data = await response.json();

    return {
        humidity: data?.main?.humidity ?? null,
        rainfall: data?.rain?.["1h"] ?? 0
    };
};