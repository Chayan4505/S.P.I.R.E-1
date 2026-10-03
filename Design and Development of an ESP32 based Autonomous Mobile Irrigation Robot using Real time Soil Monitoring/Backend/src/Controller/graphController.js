import Telemetry from "../Models/Telemetry.js";
import Robot from "../Models/Robot.js";

export const getGraphData = async (req, res, next) => {
    try {
        const { robotId } = req.params;
        const { period = "day" } = req.query;

        const robot = await Robot.findOne({
            robotId,
            owner: req.user._id
        });

        if (!robot) {
            return res.status(404).json({
                success: false,
                message: "Robot not found."
            });
        }

        const now = new Date();
        let fromDate = new Date(now);
        let groupId = {};

        switch (period) {
            case "day":
                fromDate.setDate(now.getDate() - 1);
                groupId = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    hour: { $hour: "$createdAt" },
                    minute: {
                        $subtract: [
                            { $minute: "$createdAt" },
                            {
                                $mod: [
                                    { $minute: "$createdAt" },
                                    30
                                ]
                            }
                        ]
                    }
                };
                break;

            case "week":
                fromDate.setDate(now.getDate() - 7);
                groupId = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    hour: {
                        $subtract: [
                            { $hour: "$createdAt" },
                            {
                                $mod: [
                                    { $hour: "$createdAt" },
                                    6
                                ]
                            }
                        ]
                    }
                };
                break;

            case "month":
                fromDate.setMonth(now.getMonth() - 1);
                groupId = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" }
                };
                break;

            case "year":
                fromDate.setFullYear(now.getFullYear() - 1);
                groupId = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    half: {
                        $cond: [
                            {
                                $lte: [
                                    { $dayOfMonth: "$createdAt" },
                                    15
                                ]
                            },
                            1,
                            2
                        ]
                    }
                };
                break;

            default:
                fromDate.setDate(now.getDate() - 1);
                groupId = {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                    hour: { $hour: "$createdAt" },
                    minute: {
                        $subtract: [
                            { $minute: "$createdAt" },
                            {
                                $mod: [
                                    { $minute: "$createdAt" },
                                    30
                                ]
                            }
                        ]
                    }
                };
        }

        const telemetry = await Telemetry.aggregate([
            {
                $match: {
                    robotId,
                    createdAt: {
                        $gte: fromDate
                    }
                }
            },
            {
                $group: {
                    _id: groupId,
                    moisture: { $avg: "$soil.moisture" },
                    temperature: { $avg: "$soil.temperature" },
                    ec: { $avg: "$soil.ec" },
                    ph: { $avg: "$soil.ph" },
                    nitrogen: { $avg: "$soil.nitrogen" },
                    phosphorus: { $avg: "$soil.phosphorus" },
                    potassium: { $avg: "$soil.potassium" },
                    salinity: { $avg: "$soil.salinity" },
                    tds: { $avg: "$soil.tds" },
                }
            },
            {
                $project: {
                    _id: 0,
                    timestamp: {
                        $switch: {
                            branches: [
                                {
                                    case: {
                                        $eq: [period, "year"]
                                    },
                                    then: {
                                        $dateFromParts: {
                                            year: "$_id.year",
                                            month: "$_id.month",
                                            day: {
                                                $cond: [
                                                    {
                                                        $eq: [
                                                            "$_id.half",
                                                            1
                                                        ]
                                                    },
                                                    1,
                                                    16
                                                ]
                                            }
                                        }
                                    }
                                },
                                {
                                    case: {
                                        $eq: [period, "month"]
                                    },
                                    then: {
                                        $dateFromParts: {
                                            year: "$_id.year",
                                            month: "$_id.month",
                                            day: "$_id.day"
                                        }
                                    }
                                },
                                {
                                    case: {
                                        $eq: [period, "week"]
                                    },
                                    then: {
                                        $dateFromParts: {
                                            year: "$_id.year",
                                            month: "$_id.month",
                                            day: "$_id.day",
                                            hour: "$_id.hour"
                                        }
                                    }
                                }
                            ],
                            default: {
                                $dateFromParts: {
                                    year: "$_id.year",
                                    month: "$_id.month",
                                    day: "$_id.day",
                                    hour: "$_id.hour",
                                    minute: "$_id.minute"
                                }
                            }
                        }
                    },

                    moisture: { $round: ["$moisture", 2] },
                    temperature: { $round: ["$temperature", 2] },
                    ec: { $round: ["$ec", 2] },
                    ph: { $round: ["$ph", 2] },
                    nitrogen: { $round: ["$nitrogen", 2] },
                    phosphorus: { $round: ["$phosphorus", 2] },
                    potassium: { $round: ["$potassium", 2] },
                    salinity: { $round: ["$salinity", 2] },
                    tds: { $round: ["$tds", 2] },
                }
            },
            {
                $sort: {
                    timestamp: 1
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            period,
            points: telemetry.length,
            telemetry
        });
    } catch (error) {
        next(error);
    }
};
