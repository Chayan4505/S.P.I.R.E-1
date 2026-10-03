import WebSocket from "ws";
import bcrypt from "bcryptjs";
import Robot from "../Models/Robot.js";
import PendingRobot from "../Models/PendingRobot.js";
import Telemetry from "../Models/Telemetry.js";
import Alert from "../Models/Alert.js";
import Notification from "../Models/Notification.js";
import { robotConnections, robotSockets } from "../Websocket/clients.js";

export const pairRobot = async (req, res, next) => {
    try {
        const { robotId, name, pairCode } = req.body;

        if (!robotId || !name || !pairCode) {
            return res.status(400).json({
                success: false,
                message: "Robot ID,Name and pairCode are required."
            });
        }

        const pendingRobot = await PendingRobot.findOne({ robotId });

        if (!pendingRobot) {
            return res.status(404).json({
                success: false,
                message: "Robot not found or already paired."
            });
        }

        const validPairCode = await bcrypt.compare(pairCode, pendingRobot.pairCode);

        if (!validPairCode) {
            return res.status(401).json({
                success: false,
                message: "Invalid Pair Code."
            });
        }

        const robotExists = await Robot.findOne({ robotId });

        if (robotExists) {
            return res.status(409).json({
                success: false,
                message: "Robot already paired."
            });
        }

        const robot = await Robot.create({
            owner: req.user._id,
            robotId,
            name: name.trim(),
            firmwareVersion: pendingRobot.firmwareVersion,
            isOnline: false,
            lastSeen: null
        });

        await PendingRobot.deleteOne({
            _id: pendingRobot._id
        });

        const ws = robotSockets.get(robotId);

        if (ws && ws.readyState === WebSocket.OPEN) {

            robot.isOnline = true;
            robot.lastSeen = new Date();
            await robot.save();

            robotConnections.set(ws, {
                robot,
                connectedAt: new Date()
            });

            ws.send(JSON.stringify({
                type: "robot-paired",
                payload: {
                    success: true,
                    robotId,
                    name
                }
            }));
        }

        return res.status(201).json({
            success: true,
            message: "Robot paired successfully.",
            robot
        });
    } catch (error) {
        next(error);
    }
};

export const getPendingRobots = async (req, res, next) => {
    try {
        const robots = await PendingRobot
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            robots
        });
    } catch (error) {
        next(error);
    }
};

export const getMyRobots = async (req, res, next) => {
    try {
        const robots = await Robot
            .find({
                owner: req.user._id
            })
            .sort({
                createdAt: -1
            });

        return res.status(200).json({
            success: true,
            robots
        });
    } catch (error) {
        next(error);
    }
};

export const deleteRobot = async (req, res, next) => {
    try {
        const { robotId } = req.params;

        const robot = await Robot.findOneAndDelete({
            owner: req.user._id,
            robotId
        });

        if (!robot) {
            return res.status(404).json({
                success: false,
                message: "Robot not found."
            });
        }
        
        await Telemetry.deleteMany({ robotId });
        await Alert.deleteMany({ robotId });
        await Notification.deleteMany({ robotId });

        const ws = robotSockets.get(robotId);

        if (ws && ws.readyState === WebSocket.OPEN) {

            ws.send(JSON.stringify({
                type: "robot-unpaired"
            }));

            robotConnections.delete(ws);
            robotSockets.delete(robotId);

            try {
                ws.close();
            } catch (_) { }
        }

        return res.status(200).json({
            success: true,
            message: "Robot deleted successfully."
        });
    } catch (error) {
        next(error);
    }
};