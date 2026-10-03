import { robotConnections, userSockets } from "./clients.js";
import { createAlert } from "../Services/alertService.js";

export const handleAlert = async (ws, data) => {
    try {
        const connection = robotConnections.get(ws);
        if (!connection) {
            ws.send(JSON.stringify({
                type: "alert-error",
                payload: {
                    message: "Robot not authenticated."
                }
            }));
            return;
        }

        const { robot } = connection;
        const alert = await createAlert(robot,data.payload);
        const dashboards = userSockets.get(robot.owner.toString());
        
        if (dashboards) {
            const packet = JSON.stringify({
                type: "alert",
                payload: alert
            });
            dashboards.forEach(client => {
                if (client.readyState === 1) {
                    client.send(packet);
                }
            });
        }
        console.log(
            `[ALERT] ${robot.robotId} : ${alert.type}`
        );
    } catch (error) {
        console.error("Alert Error:", error);
    }
}