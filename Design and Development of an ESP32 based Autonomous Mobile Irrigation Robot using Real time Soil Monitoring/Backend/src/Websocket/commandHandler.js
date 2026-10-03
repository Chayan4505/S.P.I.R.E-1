import { robotSockets } from "./clients.js";

export const handleRobotCommand = async (ws, data) => {
    try {
        if (!ws.userId) {
            ws.send(JSON.stringify({
                type: "command-error",
                payload: {
                    message: "Unauthorized. Please connect as dashboard first."
                }
            }));
            return;
        }

        const { robotId, command, value } = data.payload;

        if (!robotId || !command) {
            ws.send(JSON.stringify({
                type: "command-error",
                payload: {
                    message: "robotId and command are required."
                }
            }));
            return;
        }

        const robotSocket = robotSockets.get(robotId);

        if (!robotSocket) {
            ws.send(JSON.stringify({
                type: "command-error",
                payload: {
                    message: "Robot is offline."
                }
            }));
            return;
        }

        robotSocket.send(JSON.stringify({
            type: "robot-command",
            payload: {
                command,
                value
            }
        }));

        ws.send(JSON.stringify({
            type: "command-sent",
            payload: {
                success: true,
                robotId,
                command
            }
        }));

    }
    catch (error) {
        console.error(error);
        ws.send(JSON.stringify({
            type: "command-error",
            payload: {
                message: "Failed to send command."
            }
        }));
    }
};