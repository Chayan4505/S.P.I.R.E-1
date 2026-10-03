import { saveTelemetry } from "../Services/telemetryService.js";
import { robotConnections, userSockets } from "./clients.js";

export const handleTelemetry = async (ws, data) => {
    try {
        const connection = robotConnections.get(ws);
        if (!connection) {
            ws.send(JSON.stringify({
                type: "telemetry-error",
                payload: {
                    message: "Robot not authenticated."
                }
            }));
            return;
        }

        const { robot } = connection;
        const telemetry = await saveTelemetry(robot, data.payload);
        if (!telemetry) {
            return;
        }
        const ownerId = robot.owner.toString();
        const dashboards = userSockets.get(ownerId);

        if (dashboards) {
            const packet = JSON.stringify({
                type: "telemetry",
                payload: telemetry
            });

            dashboards.forEach(client => {
                if (client.readyState === 1) {
                    client.send(packet);
                }
            });
        }
    }
    catch (error) {
        console.error("Telemetry Error:", error);
        ws.send(JSON.stringify({
            type: "telemetry-error",
            payload: {
                message: "Failed to process telemetry."
            }
        }));
    }
};