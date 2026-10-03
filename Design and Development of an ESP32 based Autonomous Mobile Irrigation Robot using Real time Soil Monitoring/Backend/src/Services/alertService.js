import Alert from "../Models/Alert.js";

export const createAlert = async (robot, payload) => {
    const alert = await Alert.create({
        owner: robot.owner,
        robot: robot._id,
        robotId: robot.robotId,
        type: payload.type,
        severity: payload.severity,
        title: payload.title,
        message: payload.message
    });
    return alert;
};