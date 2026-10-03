import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    robot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Robot",
        required: true
    },

    robotId: {
        type: String,
        required: true,
        index: true
    },

    type: {
        type: String,
        required: true,
        enum: [
            "ROBOT_CONNECTED",
            "ROBOT_DISCONNECTED",
            "AUTO_MODE",
            "MANUAL_MODE",
            "PUMP_STARTED",
            "PUMP_STOPPED",
            "CUSTOM"
        ]
    },

    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    isRead: {
        type: Boolean,
        default: false
    }

},
    {
        timestamps: true
    });

notificationSchema.index({
    owner: 1,
    createdAt: -1
});

export default mongoose.model("Notification", notificationSchema);