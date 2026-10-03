import Alert from "../Models/Alert.js";
import { userSockets } from "../Websocket/clients.js";

export const getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
        return res.status(200).json({
            success: true,
            count: alerts.length,
            alerts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch alerts."
        });
    }
};

export const deleteAllAlerts = async (req, res) => {
    try {
        const result = await Alert.deleteMany({ owner: req.user._id });
        const dashboards = userSockets.get(req.user._id.toString());

        if (dashboards) {
            const packet = JSON.stringify({
                type: "alerts-cleared",
                payload: {
                    deletedCount: result.deletedCount
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
            deletedCount: result.deletedCount,
            message: "All alerts deleted successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete alerts."
        });
    }
};

export const markAllAlertsRead = async (req, res) => {
    try {
        const result = await Alert.updateMany(
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
                type: "alerts-read-all",
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
            message: "All alerts marked as read."
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update alerts."
        });
    }
};