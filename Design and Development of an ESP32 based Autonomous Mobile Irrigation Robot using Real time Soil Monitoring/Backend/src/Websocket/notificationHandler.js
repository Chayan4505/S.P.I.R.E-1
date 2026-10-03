import {robotConnections, userSockets} from "./clients.js";
import { createNotification } from "../Services/notificationService.js";

export const handleNotification = async (ws,data) => {
    try {
        const connection = robotConnections.get(ws);

        if (!connection)
            return;

        const { robot } = connection;
        const notification = await createNotification( robot, data.payload );
        const dashboards = userSockets.get(robot.owner.toString());

        if (dashboards) {
            const packet = JSON.stringify({
                type: "notification",
                payload: notification
            });

            dashboards.forEach(client => {
                if (client.readyState === 1) {
                    client.send(packet);
                }
            });
        }
    } catch (error) {
        console.error(error);
    }
};