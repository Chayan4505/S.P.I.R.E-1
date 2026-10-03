import Telemetry from "../Models/Telemetry.js";
import Robot from "../Models/Robot.js";

export const getLatestTelemetry = async (req, res) => {
    try {
        const { robotId } = req.params;

        const robot = await Robot.findOne({
            robotId,
            owner: req.user._id
        });

        if (!robot) {
            return res.status(404).json({
                success: false,
                message: "Robot not found."
            });
        }

        const telemetry = await Telemetry
            .findOne({ robotId })
            .sort({ createdAt: -1 }).lean();

        res.json({
            success: true,
            telemetry
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const getTelemetryHistory = async (req, res) => {
    try {
        const { robotId } = req.params;

        const robot = await Robot.findOne({
            robotId,
            owner: req.user._id
        });

        if (!robot) {
            return res.status(404).json({
                success: false,
                message: "Robot not found."
            });
        }

        const telemetry = await Telemetry
            .find(
                { robotId },
                {
                    _id: 0,
                    createdAt: 1,
                    mode: 1,
                    pumpStatus: 1,
                    waterLevel: 1,
                    soil: 1,
                    gps: 1
                }
            )
            .sort({
                createdAt: -1
            })
            .limit(100)
            .lean();

        return res.status(200).json({
            success: true,
            count: telemetry.length,
            telemetry
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch telemetry history."
        });

    }

};

export const getRobotPath = async (req, res) => {
    try {
        const { robotId } = req.params;

        const robot = await Robot.findOne({
            robotId,
            owner: req.user._id
        });

        if (!robot) {
            return res.status(404).json({
                success: false,
                message: "Robot not found."
            });
        }

        if (!robot.currentSessionStartedAt) {
            return res.status(200).json({
                success: true,
                points: 0,
                path: []
            });
        }

        const path = await Telemetry.find(
            {
                robotId,
                createdAt: {
                    $gte: robot.currentSessionStartedAt
                },
                "gps.coordinates": {
                    $exists: true
                },
                "gps.valid": true
            },
            {
                _id: 0,
                "gps.coordinates": 1,
                "gps.satellites": 1,
                "gps.altitude": 1,
                 createdAt: 1
            }
        ).sort({
            createdAt: 1
        }).lean();
        return res.status(200).json({
            success: true,
            points: path.length,
            path
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Unable to fetch robot path."
        });
    }
};