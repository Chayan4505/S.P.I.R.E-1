import Notification from "../Models/Notification.js";
import { userSockets } from "../Websocket/clients.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const deleteAllNotifications = async (req, res) => {
        try {
            const result = await Notification.deleteMany({ owner: req.user._id });

            const dashboards = userSockets.get( req.user._id.toString());

            if (dashboards) {
                const packet = JSON.stringify({
                    type: "notifications-cleared",
                    payload: {
                        deletedCount:
                            result.deletedCount
                    }
                });

                dashboards.forEach(client => {
                    if (client.readyState === 1) {
                        client.send(packet);
                    }
                });
            }

            res.status(200).json({
                success: true,
                deletedCount:
                    result.deletedCount
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }
    };

    export const markAllNotificationsRead = async (req, res) => {
    try {
        const result = await Notification.updateMany(
            {
                owner: req.user._id,
                isRead: false
            },
            {
                isRead: true
            }
        );

        const dashboards = userSockets.get( req.user._id.toString() );

        if (dashboards) {
            const packet = JSON.stringify({
                type: "notifications-read-all",
                payload: {
                    modifiedCount: result.modifiedCount
                }
            });

            dashboards.forEach(client => {
                if (client.readyState === 1) {
                    client.send(packet);
                }
            });
        }

        return res.status(200).json({
            success: true,
            modifiedCount: result.modifiedCount,
            message: "All notifications marked as read."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};