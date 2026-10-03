import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
    {
        robot:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Robot",
            required: true,
            index: true
        },

        robotId:
        {
            type: String,
            required: true,
            trim: true,
            index: true
        },

        mode:
        {
            type: String,
            enum: ["AUTO", "MANUAL"],
            default: "MANUAL"
        },

        pumpStatus:
        {
            type: String,
            enum: ["ON", "OFF"],
            default: "OFF"
        },

        waterLevel:
        {
            type: String,
            enum: ["LOW", "OK"],
            default: "LOW"
        },

        soil:
        {
            moisture:
            {
                type: Number,
                required: true
            },

            temperature:
            {
                type: Number,
                required: true
            },

            ec:
            {
                type: Number,
                required: true
            },

            ph:
            {
                type: Number,
                required: true
            },

            nitrogen:
            {
                type: Number,
                required: true
            },

            phosphorus:
            {
                type: Number,
                required: true
            },

            potassium:
            {
                type: Number,
                required: true
            },

            salinity:
            {
                type: Number,
                required: true
            },

            tds:
            {
                type: Number,
                required: true
            },

            valid:
            {
                type: Boolean,
                default: false
            }
        },

        gps:
        {
            type:
            {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates:
            {
                type: [Number],
                required: true
            },

            satellites:
            {
                type: Number,
                default: 0
            },

            altitude:
            {
                type: Number,
                default: 0
            },

            valid:
            {
                type: Boolean,
                default: false
            }
        }

    },
    {
        timestamps: true
    });

telemetrySchema.index(
    {
        "gps": "2dsphere"
    });

telemetrySchema.index(
    {
        robotId: 1,
        createdAt: -1
    });

export default mongoose.model("Telemetry", telemetrySchema);