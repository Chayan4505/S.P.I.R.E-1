import Notification from "../Models/Notification.js";

export const createNotification = async (robot, payload) => {
    return await Notification.create({
        owner: robot.owner,
        robot: robot._id,
        robotId: robot.robotId,
        type: payload.type,
        title: payload.title,
        message: payload.message
    });
};