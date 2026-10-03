import { robotConnections, userSockets } from "./clients.js";

export const handleRobotStatus = async (ws, data) => {
    try {
        const connection = robotConnections.get(ws);

        if (!connection) {
            return;
        }

        const { robot } = connection;
        const ownerId = robot.owner.toString();
        const dashboards = userSockets.get(ownerId);

        if (!dashboards) {
            return;
        }

        const packet = JSON.stringify({
            type: "robot-status",
            payload: {
                robotId: robot.robotId,
                ...data.payload
            }
        });

        dashboards.forEach(client => {
            if (client.readyState === 1) {
                client.send(packet);
            }
        });
    }
    catch (error) {
        console.error("Robot Status Error:", error);
    }
};