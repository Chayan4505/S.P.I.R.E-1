import { robotConnections, robotSockets, userSockets } from "./clients.js";
import Robot from "../Models/Robot.js";

const HEARTBEAT_INTERVAL = 30000;

export const startHeartbeat = (wss) => {
    setInterval(async () => {
        for (const client of wss.clients) {
            if (client.isAlive === false) {
                const connection = robotConnections.get(client);
                if (connection) {
                    const { robot } = connection;

                    const now = new Date();

                    await Robot.findByIdAndUpdate(
                        robot._id,
                        {
                            isOnline: false,
                            lastSeen: now
                        }
                    );

                    const dashboards = userSockets.get(robot.owner.toString());

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

                    robotConnections.delete(client);
                    robotSockets.delete(robot.robotId);

                    console.log(`Robot Timed Out : ${robot.robotId}`);
                }
                if (client.userId) {
                    const sockets = userSockets.get(client.userId);

                    if (sockets) {
                        sockets.delete(client);
                        if (sockets.size === 0) {
                            userSockets.delete(client.userId);
                        }
                    }
                }
                client.terminate();
                continue;
            }

            client.isAlive = false;
            client.ping();
        }
    }, HEARTBEAT_INTERVAL);
};