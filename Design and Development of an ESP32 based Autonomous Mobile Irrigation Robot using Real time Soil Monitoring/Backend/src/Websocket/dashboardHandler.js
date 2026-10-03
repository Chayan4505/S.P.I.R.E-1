import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { userSockets } from "./clients.js";

const getTokenFromCookie = (cookieHeader) => {
    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(";");

    const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("token=")
    );

    if (!tokenCookie) {
        return null;
    }

    return decodeURIComponent(
        tokenCookie.trim().slice("token=".length)
    );
};

export const handleDashboardConnect = async (ws, data, request) => {
    try {
        let token = null;

        if (data?.payload?.token) {
            token = data.payload.token;
        }

        if (!token) {
            token = getTokenFromCookie(request?.headers?.cookie);
        }

        if (!token) {
            ws.send(
                JSON.stringify({
                    type: "dashboard-error",
                    payload: {
                        message: "Authentication required.",
                    },
                })
            );

            return ws.close();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            ws.send(
                JSON.stringify({
                    type: "dashboard-error",
                    payload: {
                        message: "User not found.",
                    },
                })
            );

            return ws.close();
        }

        const userId = user._id.toString();

        if (!userSockets.has(userId)) {
            userSockets.set(userId, new Set());
        }

        userSockets.get(userId).add(ws);

        ws.userId = userId;

        ws.send(
            JSON.stringify({
                type: "dashboard-connected",
                payload: {
                    success: true,
                },
            })
        );

        console.log(`Dashboard Connected : ${user.email}`);
    } catch (error) {
        console.error(
            "Dashboard WebSocket Authentication Error:",
            error
        );

        ws.send(
            JSON.stringify({
                type: "dashboard-error",
                payload: {
                    message: "Invalid authentication.",
                },
            })
        );

        ws.close();
    }
};