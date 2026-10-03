import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronDown, Download, Droplets, Gauge, MapPin, RefreshCw, Sprout, Thermometer, } from "lucide-react";
import api from "../api/axios";

const INITIAL_VISIBLE = 10;
const LOAD_MORE_COUNT = 10;

const TelemetryHistory = ({ robotId, robotName }) => {
    const [telemetry, setTelemetry] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

    const date = new Date().toISOString().split("T")[0];

    const fetchHistory = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            const res = await api.get(`/telemetry/history/${robotId}`);

            setTelemetry(res.data.telemetry || []);
            setVisibleCount(INITIAL_VISIBLE);
        } catch (error) {
            console.error("Failed to fetch telemetry history:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load telemetry history."
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (!robotId) return;
        fetchHistory();
    }, [robotId]);

    const visibleTelemetry = useMemo(() => {
        return telemetry.slice(0, visibleCount);
    }, [telemetry, visibleCount]);

    const hasMore = visibleCount < telemetry.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) =>
            Math.min(prev + LOAD_MORE_COUNT, telemetry.length)
        );
    };

    const formatDate = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const formatNumber = (value, decimals = 1) => {
        if (value === undefined || value === null) return "—";

        return Number(value).toFixed(decimals);
    };

    const getCoordinates = (gps) => {
        if (gps?.valid === false) {
            return "No fix";
        }

        if (
            !gps?.coordinates ||
            gps.coordinates.length < 2
        ) {
            return "—";
        }

        const [longitude, latitude] = gps.coordinates;

        return `${Number(latitude).toFixed(4)}, ${Number(
            longitude
        ).toFixed(4)}`;
    };

    if (!robotId) {
        return (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <p className="text-sm text-zinc-500">
                    No S.P.I.R.E. robot selected.
                </p>
            </div>
        );
    }

    const handleExportCSV = async () => {
        if (!robotId || exporting) return;

        try {
            setExporting(true);
            const response = await api.get(`/export/csv/${robotId}`, { responseType: "blob", });

            const blob = new Blob([response.data], {
                type: "text/csv;charset=utf-8;",
            });

            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a");
            link.href = url;
            const trimRobotName = robotName.replace(/\s+/g, "");
            link.download = `telemetry-${trimRobotName}-${date}.csv`;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export telemetry CSV :", error);

            // Because an error response is also received as a Blob
            if (error.response?.data instanceof Blob) {
                try {
                    const errorText = await error.response.data.text();
                    const errorData = JSON.parse(errorText);
                    setError(errorData.message || "CSV export failed.");
                    return;
                } catch {
                    // Ignore parsing failure
                }
            }
            setError("CSV export failed. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    return (
        <section className="space-y-5">
            {/* Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 mt-5">
                        <Activity className="size-5 text-green-600" />

                        <p className="text-2xl max-md:text-lg font-semibold tracking-tight text-zinc-900">
                            Telemetry History
                        </p>
                    </div>

                    <p className="mt-1 text-sm text-zinc-500">
                        Historical soil, GPS and robot status data for{" "}
                        <span className="font-medium text-zinc-700">
                            {robotId}
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        disabled={exporting}
                        className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700 transition hover:border-green-300 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-60">
                        <Download className={`size-4 ${exporting ? "animate-pulse" : ""}`}/>
                        {exporting ? "Exporting..." : "Export CSV"}
                    </button>

                    <button
                        type="button"
                        onClick={() => fetchHistory(true)}
                        disabled={refreshing}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60">
                        <RefreshCw className={`size-4 ${refreshing ? "animate-spin" : ""}`}/>
                        Refresh
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
                    <RefreshCw className="mx-auto size-6 animate-spin text-green-600" />

                    <p className="mt-3 text-sm text-zinc-500">
                        Loading telemetry history...
                    </p>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                    <p className="text-sm font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => fetchHistory()}
                        className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && telemetry.length === 0 && (
                <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
                    <Activity className="mx-auto size-8 text-zinc-300" />

                    <h3 className="mt-3 font-semibold text-zinc-800">
                        No telemetry history
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                        Telemetry records for this S.P.I.R.E. robot will appear here.
                    </p>
                </div>
            )}

            {!loading && !error && telemetry.length > 0 && (
                <>
                    <div className="hidden overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm md:block">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-312.5 text-left">
                                <thead className="border-b border-zinc-200 bg-zinc-50/80">
                                    <tr className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                        <th className="px-5 py-4">Date / Time</th>
                                        <th className="px-5 py-4">Mode</th>
                                        <th className="px-5 py-4">Moisture</th>
                                        <th className="px-5 py-4">Temperature</th>
                                        <th className="px-5 py-4">pH</th>
                                        <th className="px-5 py-4">N</th>
                                        <th className="px-5 py-4">P</th>
                                        <th className="px-5 py-4">K</th>
                                        <th className="px-5 py-4">EC</th>
                                        <th className="px-5 py-4">TDS</th>
                                        <th className="px-5 py-4">Water</th>
                                        <th className="px-5 py-4">Pump</th>
                                        <th className="px-5 py-4">GPS</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-zinc-100">
                                    {visibleTelemetry.map((item, index) => (
                                        <tr
                                            key={`${item.createdAt}-${index}`}
                                            className="text-sm transition hover:bg-green-50/40"
                                        >
                                            {/* Date / Time */}
                                            <td className="whitespace-nowrap px-5 py-4">
                                                <div className="font-medium text-zinc-800">
                                                    {formatDate(item.createdAt)}
                                                </div>

                                                <div className="mt-0.5 text-xs text-zinc-400">
                                                    {formatTime(item.createdAt)}
                                                </div>
                                            </td>

                                            {/* Mode */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.mode === "AUTO"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {item.mode}
                                                </span>
                                            </td>

                                            {/* Moisture */}
                                            <td className="px-5 py-4 text-zinc-700">
                                                    {formatNumber(item.soil?.moisture)}%
                                            </td>

                                            {/* Temperature */}
                                            <td className="px-5 py-4 text-zinc-700">
                                                {formatNumber(item.soil?.temperature)}°C
                                            </td>

                                            {/* pH */}
                                            <td className="px-5 py-4 text-zinc-700">
                                                {formatNumber(item.soil?.ph, 2)}
                                            </td>

                                            {/* N */}
                                            <td className="px-5 py-4 text-zinc-700">
                                                {formatNumber(item.soil?.nitrogen, 0)}
                                            </td>

                                            {/* P */}
                                            <td className="px-5 py-4 text-zinc-700">
                                                {formatNumber(item.soil?.phosphorus, 0)}
                                            </td>

                                            {/* K */}
                                            <td className="px-5 py-4 text-zinc-700">
                                                {formatNumber(item.soil?.potassium, 0)}
                                            </td>

                                            {/* EC */}
                                            <td className="px-5 py-4 text-zinc-700">
                                                {formatNumber(item.soil?.ec, 2)}
                                            </td>

                                            {/* TDS */}
                                            <td className="px-5 py-4 text-zinc-700">
                                                {formatNumber(item.soil?.tds, 0)}
                                            </td>

                                            {/* Water */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.waterLevel === "OK"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {item.waterLevel}
                                                </span>
                                            </td>

                                            {/* Pump */}
                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.pumpStatus === "ON"
                                                            ? "bg-blue-100 text-blue-700"
                                                            : "bg-zinc-100 text-zinc-600"
                                                        }`}
                                                >
                                                    {item.pumpStatus}
                                                </span>
                                            </td>

                                            {/* GPS */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-1.5 text-zinc-700">
                                                    <MapPin className="size-3.5 text-green-600" />

                                                    <span className="whitespace-nowrap text-xs">
                                                        {getCoordinates(item.gps)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* =========================
              MOBILE CARDS
             ========================= */}
                    <div className="space-y-3 md:hidden">
                        {visibleTelemetry.map((item, index) => (
                            <div
                                key={`${item.createdAt}-${index}`}
                                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                            >
                                {/* Card Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-800">
                                            {formatDate(item.createdAt)}
                                        </p>

                                        <p className="mt-0.5 text-xs text-zinc-400">
                                            {formatTime(item.createdAt)}
                                        </p>
                                    </div>

                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${item.mode === "AUTO"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-blue-100 text-blue-700"
                                            }`}
                                    >
                                        {item.mode}
                                    </span>
                                </div>

                                {/* Main Soil Stats */}
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <HistoryStat
                                        icon={<Droplets className="size-3.5" />}
                                        label="Moisture"
                                        value={`${formatNumber(
                                            item.soil?.moisture
                                        )}%`}
                                    />

                                    <HistoryStat
                                        icon={<Thermometer className="size-3.5" />}
                                        label="Temperature"
                                        value={`${formatNumber(
                                            item.soil?.temperature
                                        )}°C`}
                                    />

                                    <HistoryStat
                                        icon={<Sprout className="size-3.5" />}
                                        label="pH"
                                        value={formatNumber(item.soil?.ph, 2)}
                                    />

                                    <HistoryStat
                                        icon={<Gauge className="size-3.5" />}
                                        label="EC"
                                        value={formatNumber(item.soil?.ec, 2)}
                                    />
                                </div>

                                {/* NPK */}
                                <div className="mt-3 rounded-xl bg-zinc-50 p-3">
                                    <div className="mb-2 flex items-center gap-1.5">
                                        <Sprout className="size-3.5 text-green-600" />

                                        <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                                            NPK
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <NpkValue
                                            label="N"
                                            value={item.soil?.nitrogen}
                                        />

                                        <NpkValue
                                            label="P"
                                            value={item.soil?.phosphorus}
                                        />

                                        <NpkValue
                                            label="K"
                                            value={item.soil?.potassium}
                                        />
                                    </div>
                                </div>

                                {/* Status Row */}
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <StatusPill
                                        label="Pump"
                                        value={item.pumpStatus}
                                        active={item.pumpStatus === "ON"}
                                    />

                                    <StatusPill
                                        label="Water"
                                        value={item.waterLevel}
                                        active={item.waterLevel === "OK"}
                                        danger={item.waterLevel === "LOW"}
                                    />

                                    <StatusPill
                                        label="TDS"
                                        value={formatNumber(item.soil?.tds, 0)}
                                    />
                                </div>

                                {/* GPS */}
                                <div className="mt-3 flex items-start gap-2 border-t border-zinc-100 pt-3">
                                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-green-600" />

                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                                            GPS
                                        </p>

                                        <p className="mt-0.5 text-xs text-zinc-600">
                                            {getCoordinates(item.gps)}
                                        </p>

                                        <p className="mt-0.5 text-[10px] text-zinc-400">
                                            {item.gps?.satellites ?? 0} satellites
                                            {" · "}
                                            {formatNumber(item.gps?.altitude, 1)}m
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="flex flex-col items-center gap-2 pt-2">
                        <p className="text-xs text-black">
                            Showing {visibleTelemetry.length} of{" "}
                            {telemetry.length} records
                        </p>

                        {hasMore && (
                            <button
                                type="button"
                                onClick={handleLoadMore}
                                className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                            >Load More<ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                            </button>
                        )}

                        {!hasMore && telemetry.length > 0 && (
                            <p className="text-xs text-black">
                                You have reached the end of the available history.
                            </p>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

const HistoryStat = ({ icon, label, value }) => {
    return (
        <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-400">
                {icon}

                <span className="text-[10px] font-medium">
                    {label}
                </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-zinc-800">
                {value}
            </p>
        </div>
    );
};


const NpkValue = ({ label, value }) => {
    return (
        <div>
            <p className="text-[10px] font-medium text-zinc-400">
                {label}
            </p>

            <p className="mt-0.5 text-sm font-semibold text-zinc-800">
                {value ?? "—"}
            </p>
        </div>
    );
};


const StatusPill = ({
    label,
    value,
    active = false,
    danger = false,
}) => {
    let classes =
        "bg-zinc-100 text-zinc-600";

    if (danger) {
        classes = "bg-red-50 text-red-600";
    } else if (active) {
        classes = "bg-green-50 text-green-700";
    }

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${classes}`}
        >
            <span>{label}</span>
            <span>{value}</span>
        </span>
    );
};

export default TelemetryHistory;