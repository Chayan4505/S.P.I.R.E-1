import { WebSocketServer } from "ws";
import bcrypt from "bcryptjs";
import Robot from "../Models/Robot.js";
import PendingRobot from "../Models/PendingRobot.js";
import { robotConnections, robotSockets, userSockets } from "./clients.js";
import { handleTelemetry } from "./telemetryHandler.js"
import { handleDashboardConnect } from "./dashboardHandler.js";
import { handleRobotCommand } from "./commandHandler.js";
import { handleRobotStatus } from "./statusHandler.js";
import { startHeartbeat } from "./heartbeat.js";
import { handleAlert } from "./alertHandler.js";
import { handleNotification } from "./notificationHandler.js";

let wss;
const SESSION_TIMEOUT = 2 * 60 * 1000;

export const initializeWebSocket = (server) => {
    wss = new WebSocketServer({ server });
    startHeartbeat(wss);
    wss.on("connection", (ws, request) => {
        console.log("New WebSocket Connected");

        ws.isAlive = true;
        ws.on("pong", () => { ws.isAlive = true; });

        ws.on("message", async (message) => {
            try {
                const data = JSON.parse(message.toString());

                switch (data.type) {
                    case "robot-connect": {
                        const { robotId, firmwareVersion, pairCode } = data.payload;

                        const robot = await Robot.findOne({ robotId });

                        if (robot) {
                            const now = new Date();

                            if (!robot.isOnline && (!robot.lastSeen || now - robot.lastSeen > SESSION_TIMEOUT)) {
                                robot.currentSessionStartedAt = now;
                            }

                            robot.isOnline = true;
                            robot.lastSeen = now;

                            if (firmwareVersion) {
                                robot.firmwareVersion = firmwareVersion;
                            }

                            await robot.save();

                            const dashboards = userSockets.get(robot.owner.toString());

                            if (dashboards) {
                                const packet = JSON.stringify({
                                    type: "robot-online",
                                    payload: {
                                        robotId: robot.robotId,
                                        firmwareVersion: robot.firmwareVersion,
                                        lastSeen: robot.lastSeen,
                                        currentSessionStartedAt: robot.currentSessionStartedAt
                                    }
                                });

                                dashboards.forEach(client => {
                                    if (client.readyState === 1) {
                                        client.send(packet);
                                    }
                                });
                            }

                            robotConnections.set(ws, {
                                robot,
                                connectedAt: now
                            });

                            robotSockets.set(robot.robotId, ws);

                            ws.send(JSON.stringify({
                                type: "robot-paired",
                                payload: {
                                    success: true
                                }
                            }));
                            console.log(`Robot Connected : ${robot.robotId}`);
                        }
                        else {
                            const pending = await PendingRobot.findOne({ robotId });

                            if (!pending) {
                                const hashedPairCode = await bcrypt.hash(pairCode, 10);

                                await PendingRobot.create({
                                    robotId,
                                    firmwareVersion,
                                    pairCode: hashedPairCode
                                });

                            }
                            else {
                                pending.firmwareVersion = firmwareVersion;
                                await pending.save();
                            }

                            robotSockets.set(robotId, ws);

                            ws.send(JSON.stringify({
                                type: "robot-not-paired"
                            }));
                            console.log(`Pending Robot : ${robotId}`);
                        }
                        break;
                    }

                    case "telemetry": {
                        await handleTelemetry(ws, data);
                        break;
                    }

                    case "dashboard-connect": {
                        await handleDashboardConnect(ws, data, request);
                        break;
                    }

                    case "robot-command": {
                        await handleRobotCommand(ws, data);
                        break;
                    }

                    case "robot-status": {
                        await handleRobotStatus(ws, data);
                        break;
                    }

                    case "alert": {
                        await handleAlert(ws, data);
                        break;
                    }

                    case "notification": {
                        await handleNotification(ws, data);
                        break;
                    }

                    default:
                        ws.send(JSON.stringify({
                            type: "error",
                            payload: {
                                message: `Unknown message type: ${data.type}`
                            }
                        }));
                        break;
                }
            } catch (error) {
                console.error("WebSocket Error:", error);
            }
        });

        ws.on("close", async () => {
            try {
                if (ws.userId) {
                    const sockets = userSockets.get(ws.userId);
                    if (sockets) {
                        sockets.delete(ws);
                        if (sockets.size === 0) {
                            userSockets.delete(ws.userId);
                        }
                    }
                }

                const connection = robotConnections.get(ws);
                if (!connection)
                    return;

                const { robot } = connection;

                const now = new Date();

                await Robot.findByIdAndUpdate(
                    robot._id,
                    {
                        isOnline: false,
                        lastSeen: now
                    }
                );

                const dashboards = userSockets.get(
                    robot.owner.toString()
                );

                if (dashboards) {

                    const packet = JSON.stringify({
                        type: "robot-offline",
                        payload: {
                            robotId: robot.robotId,
                            lastSeen: now
                        }
                    });

                    dashboards.forEach(client => {
                        if (client.readyState === 1) {
                            client.send(packet);
                        }
                    });

                }

                robotConnections.delete(ws);
                robotSockets.delete(robot.robotId);

                console.log(`Robot Disconnected : ${robot.robotId}`);
            }
            catch (error) {
                console.error(error);
            }
        });
    });
};

export { wss };