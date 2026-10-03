import Telemetry from "../Models/Telemetry.js";
import { getWeatherData } from "../Services/weatherService.js";

export const saveTelemetry = async (robot, data) => {
    const soil = data?.soil;
    const gps = data?.gps ?? {};

    // Soil readings are mandatory in the schema, so an invalid soil packet is still skipped.
    // GPS validity must NOT block saving: indoors / no satellite fix is normal.
    if (!soil || !soil.valid) {
        return null;
    }

    // Firmware sends GeoJSON order: gps.coordinates = [longitude, latitude].
    // Also accept separate gps.latitude / gps.longitude fields.
    const hasCoordinates =
        Array.isArray(gps.coordinates) && gps.coordinates.length === 2;

    const longitude = Number(hasCoordinates ? gps.coordinates[0] : gps.longitude);
    const latitude = Number(hasCoordinates ? gps.coordinates[1] : gps.latitude);

    const gpsValid =
        gps.valid === true &&
        Number.isFinite(latitude) &&
        Number.isFinite(longitude) &&
        Math.abs(latitude) <= 90 &&
        Math.abs(longitude) <= 180;

    let coordinates;

    if (gpsValid) {
        coordinates = [longitude, latitude];

        // Weather is informational only (currently just logged) - never let it block saving.
        try {
            const weather = await getWeatherData(latitude, longitude);
            console.log("Weather Data:", weather);
        } catch (error) {
            console.error("Weather Error:", error.message);
        }
    } else {
        // No GPS fix: keep the last known position so the document stays valid for the
        // 2dsphere index / CSV export, and flag it with gps.valid = false.
        const last = await Telemetry.findOne(
            { robotId: robot.robotId, "gps.valid": true },
            { "gps.coordinates": 1 }
        )
            .sort({ createdAt: -1 })
            .lean();

        coordinates = last?.gps?.coordinates?.length === 2
            ? last.gps.coordinates
            : [0, 0];
    }

    const telemetry = await Telemetry.create({
        robot: robot._id,
        robotId: robot.robotId,
        mode: data.mode,
        pumpStatus: data.pumpStatus,
        waterLevel: data.waterLevel,
        soil: {
            moisture: soil.moisture,
            temperature: soil.temperature,
            ec: soil.ec,
            ph: soil.ph,
            nitrogen: soil.nitrogen,
            phosphorus: soil.phosphorus,
            potassium: soil.potassium,
            salinity: soil.salinity,
            tds: soil.tds,
            valid: soil.valid
        },
        gps: {
            type: "Point",
            coordinates,
            satellites: gps.satellites ?? 0,
            altitude: gps.altitude ?? 0,
            valid: gpsValid
        }
    });
    return telemetry;
};
