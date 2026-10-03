import { createContext, useCallback, useContext, useEffect, useRef, useState,} from "react";
import { useAuth } from "./AuthContext";

const WebSocketContext = createContext(null);

export const useWebSocket = () => {
    const context = useContext(WebSocketContext);

    if (!context) {
        throw new Error("useWebSocket must be used inside WebSocketProvider");
    }
    return context;
};

const getWebSocketUrl = () => {
    if (import.meta.env.VITE_WS_URL) {
        return import.meta.env.VITE_WS_URL.replace(/\/$/, "");
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    return apiUrl.replace(/^http:/, "ws:").replace(/^https:/, "wss:").replace(/\/api\/?$/, "").replace(/\/$/, "");
};

const WS_URL = getWebSocketUrl();
const INITIAL_RECONNECT_DELAY = 2000;
const MAX_RECONNECT_DELAY = 15000;

export const WebSocketProvider = ({ children }) => {
    const { user } = useAuth();
    const socketRef = useRef(null);
    const reconnectTimerRef = useRef(null);
    const reconnectAttemptRef = useRef(0);
    const shouldReconnectRef = useRef(false);
    const [connectionState, setConnectionState] = useState("disconnected");
    const [telemetryByRobot, setTelemetryByRobot] = useState({});
    const [robotStatusByRobot, setRobotStatusByRobot] = useState({});
    const [lastAlert, setLastAlert] = useState(null);
    const [lastNotification, setLastNotification] = useState(null);
    const [lastCommand, setLastCommand] = useState(null);
    const [lastError, setLastError] = useState(null);

    const cleanupSocket = useCallback(() => {
        const socket = socketRef.current;

        if (!socket) {
            return;
        }

        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;

        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
            socket.close();
        }

        socketRef.current = null;
    }, []);

    const handleMessage = useCallback((event) => {
        try {
            const message = JSON.parse(event.data);

            if (!message?.type) {
                return;
            }

            const { type, payload } = message;

            switch (type) {
                case "dashboard-connected": {
                    console.log("[WebSocket] Dashboard authenticated");
                    setConnectionState("connected");
                    setLastError(null);
                    reconnectAttemptRef.current = 0;
                    break;
                }

                case "dashboard-error": {
                    console.error("[WebSocket] Dashboard error:", payload?.message);
                    setConnectionState("error");
                    setLastError(payload?.message || "Dashboard authentication failed.");
                    break;
                }

                case "telemetry": {
                    if (!payload?.robotId) {
                        return;
                    }
                    setTelemetryByRobot((previous) => ({
                        ...previous,
                        [payload.robotId]: payload,
                    }));
                    break;
                }

                case "robot-online": {
                    if (!payload?.robotId) {
                        return;
                    }

                    setRobotStatusByRobot((previous) => ({
                        ...previous,
                        [payload.robotId]: {
                            ...(previous[payload.robotId] || {}),
                            ...payload,
                            isOnline: true,
                        },
                    }));
                    break;
                }

                case "robot-offline": {
                    if (!payload?.robotId) {
                        return;
                    }

                    setRobotStatusByRobot((previous) => ({
                        ...previous,
                        [payload.robotId]: {
                            ...(previous[payload.robotId] || {}),
                            ...payload,
                            isOnline: false,
                        },
                    }));
                    break;
                }

                case "robot-status": {
                    if (!payload?.robotId) {
                        return;
                    }

                    setRobotStatusByRobot((previous) => ({
                        ...previous,
                        [payload.robotId]: {
                            ...(previous[payload.robotId] || {}),
                            ...payload,
                        },
                    }));
                    break;
                }

                case "alert": {
                    setLastAlert(payload || null);
                    break;
                }

                case "notification": {
                    setLastNotification(payload || null);
                    break;
                }

                case "command-sent": {
                    setLastCommand({ success: true, ...payload,});

                    setLastError(null);
                    break;
                }

                case "command-error": {
                    setLastCommand({ success: false, ...payload,});

                    setLastError( payload?.message || "Failed to send robot command.");
                    break;
                }

                case "telemetry-error": {
                    setLastError( payload?.message || "Telemetry processing failed.");
                    break;
                }

                case "error": {
                    setLastError( payload?.message || "WebSocket error.");
                    break;
                }

                default: {
                    console.debug("[WebSocket] Unhandled event:", message);
                }
            }
        } catch (error) {
            console.error("[WebSocket] Invalid server message:", error);
        }
    }, []);

    const connect = useCallback(() => {
        if (!user) {
            return;
        }

        const existingSocket = socketRef.current;
        if (existingSocket && (existingSocket.readyState === WebSocket.OPEN || existingSocket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        cleanupSocket();
        console.log("[WebSocket] Connecting:", WS_URL);
        setConnectionState("connecting");
        const socket = new WebSocket(WS_URL);
        socketRef.current = socket;
        socket.onopen = () => {
            console.log("[WebSocket] Socket connected");

            socket.send(
                JSON.stringify({
                    type: "dashboard-connect",
                    payload: {},
                })
            );
        };

        socket.onmessage = handleMessage;

        socket.onerror = (error) => {
            console.error("[WebSocket] Connection error:", error);
            setConnectionState("error");
        };

        socket.onclose = (event) => {
            console.log("[WebSocket] Closed:", event.code, event.reason);

            socketRef.current = null;

            if (!shouldReconnectRef.current) {
                setConnectionState("disconnected");
                return;
            }

            setConnectionState("reconnecting");
            const attempt = reconnectAttemptRef.current;

            const delay = Math.min(INITIAL_RECONNECT_DELAY * Math.pow(2, attempt),MAX_RECONNECT_DELAY);
            reconnectAttemptRef.current = attempt + 1;

            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }

            reconnectTimerRef.current = setTimeout(
                () => {
                    reconnectTimerRef.current = null;
                    connect();
                },delay);
        };
    }, [ user, cleanupSocket, handleMessage,]);

    const disconnect = useCallback(() => {
        shouldReconnectRef.current = false;

        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        reconnectAttemptRef.current = 0;
        cleanupSocket();
        setConnectionState("disconnected");
    }, [cleanupSocket]);

    const send = useCallback((message) => {
        const socket = socketRef.current;

        if (!socket) {
            console.warn("[WebSocket] Socket not initialized.");
            return false;
        }

        if (socket.readyState !== WebSocket.OPEN) {
            console.warn("[WebSocket] Socket is not connected.");
            return false;
        }

        try {
            socket.send(JSON.stringify(message));
            return true;
        } catch (error) {
            console.error(
                "[WebSocket] Send failed:",
                error
            );
            return false;
        }
    }, []);

    const sendRobotCommand = useCallback(({ robotId, command, value,}) => {
            if (!robotId || !command) {
                return false;
            }

            return send({
                type: "robot-command",
                payload: {
                    robotId,
                    command,
                    value,
                },
            });
        },[send]);

    useEffect(() => {
        if (!user) {
            disconnect();
            setTelemetryByRobot({});
            setRobotStatusByRobot({});
            setLastAlert(null);
            setLastNotification(null);
            setLastCommand(null);
            setLastError(null);
            return;
        }

        shouldReconnectRef.current = true;
        connect();

        return () => {
            shouldReconnectRef.current = false;

            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
            cleanupSocket();
        };
    }, [ user, connect, disconnect, cleanupSocket,]);

    const value = {connectionState, isConnected:connectionState === "connected", isConnecting:connectionState === "connecting" ||connectionState === "reconnecting", isReconnecting:connectionState === "reconnecting",telemetryByRobot,robotStatusByRobot,lastAlert,lastNotification,lastCommand,lastError,send,sendRobotCommand,reconnect: connect,disconnect,};

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketContext;