import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
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
            "LOW_WATER",
            "GPS_LOST",
            "CUSTOM"
        ]
    },

    severity: {
        type: String,
        enum: [
            "info",
            "warning",
            "critical"
        ],
        default: "warning"
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

}, {
    timestamps: true
});

alertSchema.index({
    owner:1,
    createdAt:-1
});

export default mongoose.model("Alert", alertSchema);