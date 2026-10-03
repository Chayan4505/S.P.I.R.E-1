import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import connectDatabase from "./src/Config/db.js";
import { initializeWebSocket } from "./src/Websocket/websocket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

initializeWebSocket(server);

const startServer = async () => {
    try {
        await connectDatabase();

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Server Startup Error:", error);
        process.exit(1);
    }
};

startServer();