import mongoose from "mongoose";

const pendingRobotSchema = new mongoose.Schema(
    {
        robotId: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true
        },

        firmwareVersion: {
            type: String,
            default: "1.0.0"
        },

        pairCode: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

pendingRobotSchema.index(
    {
        createdAt: 1
    },
    {
        expireAfterSeconds: 600
    }
);

export default mongoose.model("PendingRobot", pendingRobotSchema);