import { Parser } from "json2csv";
import Telemetry from "../Models/Telemetry.js";
import Robot from "../Models/Robot.js";

export const exportTelemetryCSV = async (req, res) => {
    try {
        const robot = await Robot.findOne({
            robotId: req.params.robotId,
            owner: req.user._id
        });

        if (!robot) {
            return res.status(404).json({
                success: false,
                message: "Robot not found."
            });
        }

        const telemetry = await Telemetry.find({
            robotId: req.params.robotId
        }).sort({ createdAt: 1}).lean();

        if (!telemetry.length) {
            return res.status(404).json({
                success: false,
                message: "No telemetry found."
            });
        }

        const csvData = telemetry.map(record => ({
            timestamp: record.createdAt,
            robotId: record.robotId,
            mode: record.mode,
            pumpStatus: record.pumpStatus,
            waterLevel: record.waterLevel,
            latitude: record.gps.coordinates[1],
            longitude: record.gps.coordinates[0],
            satellites: record.gps.satellites,
            altitude: record.gps.altitude,
            moisture: record.soil.moisture,
            temperature: record.soil.temperature,
            ec: record.soil.ec,
            ph: record.soil.ph,
            nitrogen: record.soil.nitrogen,
            phosphorus: record.soil.phosphorus,
            potassium: record.soil.potassium,
            salinity: record.soil.salinity,
            tds: record.soil.tds
        }));

        const parser = new Parser();
        const csv = parser.parse(csvData);

        res.header( "Content-Type","text/csv" );
        const date = new Date().toISOString().split("T")[0];
        const robotName = robot.name.replace(/\s+/g, "");
        res.attachment(`telemetry-${robotName}-${date}.csv`);
        return res.send(csv);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "CSV export failed."
        });
    }
};

// Json Data if needed : 

// export const exportTelemetryJSON = async (req, res) => {
//     try {
//         const robot = await Robot.findOne({
//             robotId: req.params.robotId,
//             owner: req.user._id
//         });

//         if (!robot) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Robot not found."
//             });
//         }

//         const telemetry = await Telemetry.find({ robotId: req.params.robotId }).sort({ createdAt: 1});

//         return res.status(200).json({
//             success: true,
//             count: telemetry.length,
//             telemetry
//         });
//     }
//     catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             success: false,
//             message: "JSON export failed."
//         });
//     }
// };