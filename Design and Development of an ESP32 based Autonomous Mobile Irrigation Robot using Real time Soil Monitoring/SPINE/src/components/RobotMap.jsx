import { GoogleMap, Marker, Polyline, useJsApiLoader, } from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";
import { Activity, MapPin, Navigation, RefreshCw, } from "lucide-react";
import api from "../api/axios";
import { useWebSocket } from "../context/WebSocketContext";

const containerStyle = {
    width: "100%",
    height: "600px",
};

const DEFAULT_ZOOM = 20;

const defaultCenter = {
    lat: 22.8666,
    lng: 88.4156,
};

const RobotMap = ({ robotId }) => {
    const { telemetryByRobot } = useWebSocket();
    const [path, setPath] = useState([]);
    const [points, setPoints] = useState(0);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const telemetry =
            telemetryByRobot[robotId];

        if (!telemetry) {
            return;
        }

        if (!telemetry.gps?.valid) {
            return;
        }

        const coordinates =
            telemetry.gps?.coordinates;

        if (
            !coordinates ||
            coordinates.length < 2
        ) {
            return;
        }

        const [lng, lat] = coordinates;

        const newPoint = {
            lat: Number(lat),
            lng: Number(lng),
            satellites:
                telemetry.gps?.satellites ?? 0,
            altitude:
                telemetry.gps?.altitude ?? 0,
            createdAt:
                telemetry.createdAt,
        };

        if (
            !Number.isFinite(newPoint.lat) ||
            !Number.isFinite(newPoint.lng)
        ) {
            return;
        }

        setPath((previousPath) => {
            const last =
                previousPath[
                previousPath.length - 1
                ];

            if (
                last &&
                last.lat === newPoint.lat &&
                last.lng === newPoint.lng
            ) {
                return previousPath;
            }

            return [
                ...previousPath,
                newPoint,
            ];
        });

        setPoints((previous) =>
            previous + 1
        );
    }, [
        telemetryByRobot,
        robotId,
    ]);

    const { isLoaded, loadError } = useJsApiLoader({
        id: "spire-google-map",
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    });

    const fetchPath = async (isRefresh = false) => {
        if (!robotId) return;

        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError("");

            // First try current session path
            const pathResponse = await api.get(`/telemetry/path/${robotId}`);
            const fetchedPath = pathResponse.data.path || [];
            let formattedPath = fetchedPath
                .filter(
                    (item) =>
                        item.gps?.coordinates &&
                        item.gps.coordinates.length >= 2
                )
                .map((item) => {
                    const [lng, lat] = item.gps.coordinates;

                    return {
                        lat: Number(lat),
                        lng: Number(lng),
                        satellites: item.gps.satellites ?? 0,
                        altitude: item.gps.altitude ?? 0,
                        createdAt: item.createdAt,
                    };
                })
                .filter(
                    (point) =>
                        Number.isFinite(point.lat) &&
                        Number.isFinite(point.lng)
                );

            setPath(formattedPath);

            setPoints(
                pathResponse.data.points ?? formattedPath.length
            );
        } catch (error) {
            console.error("Failed to fetch robot GPS:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load robot location."
            );

            setPath([]);
            setPoints(0);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        setPath([]);
        setPoints(0);

        if (robotId) {
            fetchPath();
        } else {
            setLoading(false);
        }
    }, [robotId]);

    const center = useMemo(() => {
        if (!path.length) {
            return defaultCenter;
        }

        const latest = path[path.length - 1];

        return {
            lat: latest.lat,
            lng: latest.lng,
        };
    }, [path]);

    if (loadError) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-medium text-red-700">
                    Google Maps could not be loaded.
                </p>

                <p className="mt-1 text-xs text-red-600">
                    Check your Google Maps API key and Maps JavaScript
                    API configuration.
                </p>
            </div>
        );
    }


    if (!robotId) {
        return (
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-center">
                <MapPin className="mx-auto size-7 text-zinc-300" />

                <p className="mt-3 text-sm text-zinc-500">
                    Select a S.P.I.R.E. robot to view its location.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-5 space-y-4">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <div className="flex items-center gap-2">
                        <Navigation className="size-5 text-green-600" />

                        <h2 className="text-2xl font-semibold text-zinc-900">
                            Robot Location
                        </h2>
                    </div>

                    <p className="mt-1 text-sm text-zinc-500">
                        Live GPS position for{" "}
                        <span className="font-medium text-zinc-700">
                            {robotId}
                        </span>
                    </p>
                </div>

                {/* Refresh */}
                <button
                    type="button"
                    onClick={() => fetchPath(true)}
                    disabled={refreshing || loading}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw
                        className={`size-4 ${refreshing ? "animate-spin" : ""
                            }`}
                    />

                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-700">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() => fetchPath()}
                        className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 shadow-sm">

                {loading || !isLoaded ? (
                    <div className="flex h-150 items-center justify-center bg-zinc-50">
                        <div className="text-center">
                            <RefreshCw className="mx-auto size-7 animate-spin text-green-600" />

                            <p className="mt-3 text-sm text-zinc-500">
                                Loading robot location...
                            </p>
                        </div>
                    </div>
                ) : (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={DEFAULT_ZOOM}
                        options={{
                            // Normal Google Maps
                            mapTypeId: "satellite",

                            // Controls
                            zoomControl: true,

                            // Removed
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,

                            // Cleaner map
                            clickableIcons: false,
                            gestureHandling: "greedy",
                        }}
                    >

                        {path.length > 1 && (
                            <>
                                <Polyline
                                    path={path}
                                    options={{
                                        strokeColor: "#ffffff",
                                        strokeOpacity: 0.95,
                                        strokeWeight: 9,
                                        geodesic: true,
                                        clickable: false,
                                        zIndex: 10,
                                    }}
                                />

                                <Polyline
                                    path={path}
                                    options={{
                                        strokeColor: "#2563eb",
                                        strokeOpacity: 1,
                                        strokeWeight: 5,
                                        geodesic: true,
                                        clickable: false,
                                        zIndex: 11,
                                    }}
                                />
                            </>
                        )}

                        {path.length > 0 && (
                            <Marker
                                position={{
                                    lat: path[0].lat,
                                    lng: path[0].lng,
                                }}
                                title="Session Start"
                                label={{
                                    text: "S",
                                    color: "#ffffff",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                }}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 9,
                                    fillColor: "#16a34a",
                                    fillOpacity: 1,
                                    strokeColor: "#ffffff",
                                    strokeWeight: 3,
                                }}
                            />
                        )}

                        {path.length > 0 && (
                            <Marker
                                position={{
                                    lat: path[path.length - 1].lat,
                                    lng: path[path.length - 1].lng,
                                }}
                                title="Current Robot Position"
                                label={{
                                    color: "#ffffff",
                                    fontSize: "11px",
                                    fontWeight: "700",
                                }}
                                icon={{
                                    path: window.google.maps.SymbolPath.CIRCLE,
                                    scale: 10,
                                    fillColor: "#111827",
                                    fillOpacity: 1,
                                    strokeColor: "#ffffff",
                                    strokeWeight: 3,
                                }}
                            />
                        )}
                    </GoogleMap>
                )}

                {!loading && (
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-xl border border-white/60 bg-white/90 px-3 py-2 shadow-lg backdrop-blur-md">

                        <div className="flex size-7 items-center justify-center rounded-lg bg-green-50">
                            <Activity className="size-4 text-green-600" />
                        </div>

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                                GPS Points
                            </p>

                            <p className="text-sm font-bold text-zinc-800">
                                {points}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                                Satellites
                            </p>

                            <p className="text-sm font-bold text-zinc-800">
                                {path[path.length - 1]?.satellites ?? "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-400">
                                Altitude
                            </p>

                            <p className="text-sm font-bold text-zinc-800">
                                {(
                                    path[path.length - 1]?.altitude != null
                                        ? `${Number(
                                            path[path.length - 1].altitude
                                        ).toFixed(1)} m`
                                        : "—"
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {!loading &&
                    !error &&
                    isLoaded &&
                    path.length === 0 && (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">

                            <div className="rounded-2xl border border-zinc-200 bg-white/95 px-6 py-5 text-center shadow-lg backdrop-blur">

                                <MapPin className="mx-auto size-7 text-zinc-300" />

                                <p className="mt-2 text-sm font-semibold text-zinc-700">
                                    No GPS data
                                </p>

                                <p className="mt-1 max-w-xs text-xs leading-relaxed text-zinc-400">
                                    No valid GPS position is available
                                    for this robot.
                                </p>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default RobotMap;