import { getWeatherData } from "../Services/weatherService.js";

export const testWeather = async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        const weather = await getWeatherData(
            Number(latitude),
            Number(longitude)
        );

        res.status(200).json({
            success: true,
            data: weather
        });
    } catch (error) {
        console.error("Weather test error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};