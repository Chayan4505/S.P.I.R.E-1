import mongoose from "mongoose";

const robotSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        robotId: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        firmwareVersion: {
            type: String,
            default: "1.0.0"
        },

        isOnline: {
            type: Boolean,
            default: false
        },

        lastSeen: {
            type: Date,
            default: null
        },

        currentSessionStartedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    });

export default mongoose.model("Robot", robotSchema);