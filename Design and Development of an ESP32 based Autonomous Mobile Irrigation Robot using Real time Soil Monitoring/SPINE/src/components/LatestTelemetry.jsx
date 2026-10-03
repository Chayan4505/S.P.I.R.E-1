import { useEffect, useState, useCallback } from "react";
import { Activity, Droplets, Thermometer, FlaskConical, Leaf, MapPin, Clock3, Zap, Waves, CircleGauge, RefreshCw, Satellite, Gauge, Power, Navigation, } from "lucide-react";
import { useWebSocket } from "../context/WebSocketContext";
import api from "../api/axios";

const LatestTelemetry = ({ robotId }) => {
    const { telemetryByRobot, robotStatusByRobot, } = useWebSocket();
    const [telemetry, setTelemetry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const robotOnline = robotStatusByRobot[robotId]?.isOnline ?? false;

    const fetchLatestTelemetry = useCallback(async () => {
        if (!robotId) {
            setTelemetry(null);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError("");
            const res = await api.get(`/telemetry/latest/${robotId}`);
            if (res.data.success) {
                setTelemetry(res.data.telemetry);
            } else {
                setTelemetry(null);
            }
        } catch (error) {
            console.error(
                "Failed to fetch latest telemetry:",
                error
            );
            setError(
                error.response?.data?.message ||
                "Unable to fetch latest telemetry."
            );
            setTelemetry(null);
        } finally {
            setLoading(false);
        }
    }, [robotId]);

    useEffect(() => {
        fetchLatestTelemetry();
    }, [fetchLatestTelemetry]);

    useEffect(() => {
        const realtimeTelemetry =
            telemetryByRobot[robotId];

        if (!realtimeTelemetry) {
            return;
        }

        setTelemetry(realtimeTelemetry);
        setError("");
        setLoading(false);
    }, [
        telemetryByRobot,
        robotId,
    ]);

    const formatDate = (date) => {
        if (!date) return "--";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        if (!date) return "--";

        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const formatValue = (value, unit = "") => {
        if (value === undefined || value === null) {
            return "--";
        }

        return `${value}${unit}`;
    };

    if (loading) {
        return (
            <div className="pt-22 max-md:pt-30 pb-10 md:pl-20 ml-40 max-md:ml-0">
                <div className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="animate-pulse">
                        <div className="mb-6 h-7 w-52 rounded bg-zinc-200" />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-20 rounded-2xl bg-zinc-100"
                                />
                            ))}
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="h-28 rounded-2xl bg-zinc-100"
                                    />
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!robotId) {
        return (
            <div className="pt-22 max-md:pt-30 pb-10 md:pl-20 ml-40 max-md:ml-0">
                <div className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                            <Activity
                                size={21}
                                className="text-green-600"
                            />
                        </div>

                        <div>
                            <p className="text-2xl font-semibold text-zinc-900">
                                Latest Telemetry
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                No S.P.I.R.E. robot selected.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-22 max-md:pt-22 pb-10 md:pl-20 ml-40 max-md:ml-0">
                <div className="w-full rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-semibold text-zinc-900">
                                Latest Telemetry
                            </p>

                            <p className="mt-1 text-sm text-red-500">
                                {error}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchLatestTelemetry}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition hover:bg-zinc-50 hover:text-green-600"
                            title="Retry"
                        >
                            <RefreshCw size={17} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!telemetry) {
        return (
            <div className="pt-22 max-md:pt-30 pb-10 md:pl-20 ml-40 max-md:ml-0">
                <div className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                            <Activity
                                size={21}
                                className="text-green-600"
                            />
                        </div>

                        <div>
                            <p className="text-2xl font-semibold text-zinc-900">
                                Latest Telemetry
                            </p>

                            <p className="mt-1 text-sm text-zinc-500">
                                No telemetry data available yet.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const moisture = Number(
        telemetry.soil?.moisture
    ) || 0;

    const coordinates =
        telemetry.gps?.coordinates || [];

    const longitude = coordinates[0];
    const latitude = coordinates[1];

    // Backend now stores packets without a GPS fix (gps.valid = false)
    const gpsFixLost = telemetry.gps?.valid === false;

    return (
        <div className="pt-22 max-md:pt-30 pb-10 md:pl-20 ml-40 max-md:ml-0">
            <div className="w-full overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">

                {/* HEADER */}
                <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">
                            <Activity
                                size={21}
                                className="text-green-600"
                            />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="text-2xl font-semibold text-zinc-900">
                                    Latest Telemetry
                                </p>

                                <span
                                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${robotOnline
                                            ? "bg-green-50 text-green-700"
                                            : "bg-zinc-100 text-zinc-500"
                                        }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${robotOnline
                                                ? "bg-green-500"
                                                : "bg-zinc-400"
                                            }`}
                                    />

                                    {robotOnline
                                        ? "Live"
                                        : "Offline"}
                                </span>
                            </div>

                            <p className="mt-1 text-sm text-zinc-500">
                                S.P.I.R.E. • {telemetry.robotId}
                            </p>
                        </div>
                    </div>

                    {/* DATE + TIME */}
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-50">
                            <Clock3
                                size={16}
                                className="text-zinc-500"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-medium text-zinc-700">
                                {formatDate(
                                    telemetry.createdAt
                                )}
                            </p>

                            <p className="text-[11px] text-zinc-400">
                                {formatTime(
                                    telemetry.createdAt
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* STATUS */}
                <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-3">
                    <StatusCard
                        icon={Navigation}
                        label="Operating Mode"
                        value={telemetry.mode}
                        valueClass={
                            telemetry.mode === "AUTO"
                                ? "text-green-600"
                                : "text-blue-600"
                        }
                        iconClass={
                            telemetry.mode === "AUTO"
                                ? "text-green-600"
                                : "text-blue-600"
                        }
                        iconBg={
                            telemetry.mode === "AUTO"
                                ? "bg-green-50"
                                : "bg-blue-50"
                        }
                    />

                    <StatusCard
                        icon={Power}
                        label="Pump Status"
                        value={telemetry.pumpStatus}
                        valueClass={
                            telemetry.pumpStatus === "ON"
                                ? "text-green-600"
                                : "text-zinc-600"
                        }
                        iconClass={
                            telemetry.pumpStatus === "ON"
                                ? "text-green-600"
                                : "text-zinc-500"
                        }
                        iconBg={
                            telemetry.pumpStatus === "ON"
                                ? "bg-green-50"
                                : "bg-zinc-100"
                        }
                    />

                    <StatusCard
                        icon={Droplets}
                        label="Water Tank"
                        value={telemetry.waterLevel}
                        valueClass={
                            telemetry.waterLevel === "OK"
                                ? "text-green-600"
                                : "text-red-600"
                        }
                        iconClass={
                            telemetry.waterLevel === "OK"
                                ? "text-green-600"
                                : "text-red-500"
                        }
                        iconBg={
                            telemetry.waterLevel === "OK"
                                ? "bg-green-50"
                                : "bg-red-50"
                        }
                    />
                </div>

                {/* SOIL */}
                <div className="px-5 pb-5">
                    <div className="mb-4">
                        <h2 className="text-sm font-semibold text-zinc-900">
                            Soil Conditions
                        </h2>

                        <p className="mt-0.5 text-xs text-zinc-400">
                            Latest multi-parameter soil readings
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3">
                        <TelemetryCard
                            icon={Droplets}
                            label="Moisture"
                            value={formatValue(
                                telemetry.soil?.moisture,
                                "%"
                            )}
                            iconClass="text-blue-600"
                            iconBg="bg-blue-50"
                        />

                        <TelemetryCard
                            icon={Thermometer}
                            label="Temperature"
                            value={formatValue(
                                telemetry.soil?.temperature,
                                " °C"
                            )}
                            iconClass="text-orange-600"
                            iconBg="bg-orange-50"
                        />

                        <TelemetryCard
                            icon={FlaskConical}
                            label="pH"
                            value={formatValue(
                                telemetry.soil?.ph
                            )}
                            iconClass="text-purple-600"
                            iconBg="bg-purple-50"
                        />

                        <TelemetryCard
                            icon={Zap}
                            label="EC"
                            value={formatValue(
                                telemetry.soil?.ec
                            )}
                            iconClass="text-yellow-600"
                            iconBg="bg-yellow-50"
                        />

                        <TelemetryCard
                            icon={Leaf}
                            label="Nitrogen"
                            value={formatValue(
                                telemetry.soil?.nitrogen,
                                " mg/kg"
                            )}
                            iconClass="text-green-600"
                            iconBg="bg-green-50"
                        />

                        <TelemetryCard
                            icon={Leaf}
                            label="Phosphorus"
                            value={formatValue(
                                telemetry.soil?.phosphorus,
                                " mg/kg"
                            )}
                            iconClass="text-emerald-600"
                            iconBg="bg-emerald-50"
                        />

                        <TelemetryCard
                            icon={Leaf}
                            label="Potassium"
                            value={formatValue(
                                telemetry.soil?.potassium,
                                " mg/kg"
                            )}
                            iconClass="text-lime-600"
                            iconBg="bg-lime-50"
                        />

                        <TelemetryCard
                            icon={Waves}
                            label="TDS"
                            value={formatValue(
                                telemetry.soil?.tds,
                                " ppm"
                            )}
                            iconClass="text-cyan-600"
                            iconBg="bg-cyan-50"
                        />

                        <TelemetryCard
                            icon={Waves}
                            label="Salinity"
                            value={formatValue(
                                telemetry.soil?.salinity
                            )}
                            iconClass="text-sky-600"
                            iconBg="bg-sky-50"
                        />
                    </div>

                    {/* MOISTURE BAR */}
                    <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CircleGauge
                                    size={16}
                                    className="text-green-600"
                                />

                                <span className="text-sm font-medium text-zinc-800">
                                    Soil Moisture Level
                                </span>
                            </div>

                            <span className="text-sm font-semibold text-zinc-800">
                                {formatValue(
                                    telemetry.soil?.moisture,
                                    "%"
                                )}
                            </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
                            <div
                                className="h-full rounded-full bg-linear-to-r from-green-500 to-emerald-400 transition-all duration-700"
                                style={{
                                    width: `${Math.min(
                                        Math.max(
                                            moisture,
                                            0
                                        ),
                                        100
                                    )}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* GPS */}
                <div className="border-t border-zinc-100 px-5 py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                                <MapPin
                                    size={18}
                                    className="text-red-500"
                                />
                            </div>

                            <div>
                                <p className="text-xs text-zinc-400">
                                    GPS Location
                                </p>

                                <p className="text-sm font-medium text-zinc-800">
                                    {gpsFixLost
                                        ? "No GPS fix"
                                        : `${latitude ?? "--"}, ${longitude ?? "--"}`}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="flex items-center gap-2">
                                <Satellite
                                    size={15}
                                    className="text-zinc-400"
                                />

                                <div>
                                    <p className="text-[10px] text-zinc-400">
                                        Satellites
                                    </p>

                                    <p className="text-sm font-semibold text-zinc-700">
                                        {formatValue(
                                            telemetry.gps?.satellites
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Gauge
                                    size={15}
                                    className="text-zinc-400"
                                />

                                <div>
                                    <p className="text-[10px] text-zinc-400">
                                        Altitude
                                    </p>

                                    <p className="text-sm font-semibold text-zinc-700">
                                        {formatValue(
                                            telemetry.gps?.altitude,
                                            " m"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TelemetryCard = ({
    icon: Icon,
    label,
    value,
    iconClass,
    iconBg,
}) => {
    return (
        <div className="group rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-green-100 hover:bg-white hover:shadow-sm">

            <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
            >
                <Icon
                    size={17}
                    className={iconClass}
                />
            </div>

            <p className="text-[11px] font-medium text-zinc-500">
                {label}
            </p>

            <p className="mt-1 truncate text-base font-semibold text-zinc-900">
                {value}
            </p>
        </div>
    );
};

const StatusCard = ({
    icon: Icon,
    label,
    value,
    valueClass,
    iconClass,
    iconBg,
}) => {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/60 p-3.5">

            <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
            >
                <Icon
                    size={18}
                    className={iconClass}
                />
            </div>

            <div className="min-w-0">
                <p className="text-[11px] text-zinc-400">
                    {label}
                </p>

                <p
                    className={`mt-0.5 text-sm font-semibold ${valueClass}`}
                >
                    {value || "--"}
                </p>
            </div>
        </div>
    );
};

export default LatestTelemetry;