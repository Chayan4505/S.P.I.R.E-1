import { useEffect, useState } from "react";
import {
  Activity,
  Droplets,
  FlaskConical,
  RefreshCw,
  Sprout,
  Thermometer,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import api from "../api/axios";


const PERIODS = [
  { value: "day", label: "24 Hours" },
  { value: "week", label: "7 Days" },
  { value: "month", label: "30 Days" },
  { value: "year", label: "1 Year" },
];


const AnalyticsPage = () => {
  const [robots, setRobots] = useState([]);
  const [robotId, setRobotId] = useState("");

  const [period, setPeriod] = useState("day");

  const [data, setData] = useState([]);

  const [loadingRobots, setLoadingRobots] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const fetchRobots = async () => {
    try {
      setLoadingRobots(true);

      const response = await api.get("/robot/");

      const robotList = response.data.robots || [];

      setRobots(robotList);

      if (robotList.length > 0) {
        setRobotId((current) => current || robotList[0].robotId);
      }
    } catch (error) {
      console.error("Failed to fetch robots:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load robots."
      );
    } finally {
      setLoadingRobots(false);
    }
  };

  const fetchAnalytics = async (isRefresh = false) => {
    if (!robotId) return;

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoadingData(true);
      }

      setError("");

      const response = await api.get(
        `/graphs/${robotId}`,
        {
          params: {
            period,
          },
        }
      );

      const telemetry = response.data.telemetry || [];

      const formattedData = telemetry.map((item) => ({
        ...item,

        timestamp: item.timestamp
          ? new Date(item.timestamp)
          : null,

        moisture: Number(item.moisture ?? 0),
        temperature: Number(item.temperature ?? 0),

        ec: Number(item.ec ?? 0),
        ph: Number(item.ph ?? 0),

        nitrogen: Number(item.nitrogen ?? 0),
        phosphorus: Number(item.phosphorus ?? 0),
        potassium: Number(item.potassium ?? 0),

        salinity: Number(item.salinity ?? 0),
        tds: Number(item.tds ?? 0),
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);

      setData([]);

      setError(
        error.response?.data?.message ||
          "Unable to load analytics data."
      );
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRobots();
  }, []);


  useEffect(() => {
    if (robotId) {
      fetchAnalytics();
    }
  }, [robotId, period]);

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (period === "year") {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    }

    if (period === "month") {
      return date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
    }

    if (period === "week") {
      return date.toLocaleDateString("en-IN", {
        weekday: "short",
        hour: "numeric",
        hour12: true,
      });
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const chartData = data.map((item) => ({
    ...item,

    timeLabel: formatTime(item.timestamp),
  }));

  const latest = data[data.length - 1];

  if (!loadingRobots && robots.length === 0) {
    return (
      <div className="pt-18 pb-10 md:pl-20 ml-40 max-md:ml-0">
        <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">
          <Sprout className="mx-auto size-8 text-zinc-300" />

          <h2 className="mt-4 text-lg font-semibold text-zinc-800">
            No S.P.I.R.E. robot found
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
            Pair a S.P.I.R.E. robot to start viewing soil analytics
            and historical trends.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-18 pb-10 md:pl-20 ml-40 max-md:ml-0 mt-5">

      <div className="mb-7">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <div className="flex items-center gap-2">
              <Activity className="size-5 text-green-600" />

              <p className="text-2xl font-semibold text-zinc-900">
                Analytics
              </p>
            </div>

            <p className="mt-1 text-sm text-zinc-500">
              Soil and environmental trends collected by
              your S.P.I.R.E. robot.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">

            {/* <select
              value={robotId}
              onChange={(e) => setRobotId(e.target.value)}
              disabled={loadingRobots}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 outline-none transition hover:border-green-300 focus:border-green-400 disabled:opacity-60"
            >
              {robots.map((robot) => (
                <option
                  key={robot.robotId}
                  value={robot.robotId}
                >
                  {robot.name || robot.robotId}
                </option>
              ))}
            </select> */}

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 outline-none transition hover:border-green-300 focus:border-green-400"
            >
              {PERIODS.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => fetchAnalytics(true)}
              disabled={loadingData || refreshing || !robotId}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`size-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>

          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={() => fetchAnalytics()}
            className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">

        <MetricCard
          icon={Droplets}
          label="Moisture"
          value={latest?.moisture}
          unit="%"
        />

        <MetricCard
          icon={Thermometer}
          label="Temperature"
          value={latest?.temperature}
          unit="°C"
        />

        <MetricCard
          icon={FlaskConical}
          label="pH"
          value={latest?.ph}
          unit=""
        />

        <MetricCard
          icon={Activity}
          label="EC"
          value={latest?.ec}
          unit=""
        />

      </div>

      {loadingData ? (

        <LoadingCharts />

      ) : chartData.length === 0 ? (

        <EmptyAnalytics />

      ) : (

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          <ChartCard
            title="Moisture & Temperature"
            description="Average soil moisture and temperature over time."
            icon={Droplets}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e4e4e7"
                />

                <XAxis
                  dataKey="timeLabel"
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                />

                <YAxis
                  yAxisId="left"
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}%`}
                />

                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value}°`}
                />

                <Tooltip
                  content={<AnalyticsTooltip />}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    paddingTop: "10px",
                  }}
                />

                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="moisture"
                  name="Moisture"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                  }}
                />

                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="temperature"
                  name="Temperature"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{
                    r: 5,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="NPK Levels"
            description="Average nitrogen, phosphorus and potassium levels."
            icon={Sprout}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e4e4e7"
                />

                <XAxis
                  dataKey="timeLabel"
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<AnalyticsTooltip />}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    paddingTop: "10px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="nitrogen"
                  name="Nitrogen"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="phosphorus"
                  name="Phosphorus"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="potassium"
                  name="Potassium"
                  stroke="#9333ea"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="Soil pH"
            description="Average soil acidity and alkalinity over time."
            icon={FlaskConical}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e4e4e7"
                />

                <XAxis
                  dataKey="timeLabel"
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                />

                <YAxis
                  domain={["auto", "auto"]}
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<AnalyticsTooltip />}
                />

                <Line
                  type="monotone"
                  dataKey="ph"
                  name="pH"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="EC & Salinity"
            description="Electrical conductivity and soil salinity trends."
            icon={Activity}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e4e4e7"
                />

                <XAxis
                  dataKey="timeLabel"
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<AnalyticsTooltip />}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "12px",
                    paddingTop: "10px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="ec"
                  name="EC"
                  stroke="#0891b2"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />

                <Line
                  type="monotone"
                  dataKey="salinity"
                  name="Salinity"
                  stroke="#ea580c"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard
            title="TDS"
            description="Total dissolved solids measured in the soil."
            icon={Activity}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e4e4e7"
                />

                <XAxis
                  dataKey="timeLabel"
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={30}
                />

                <YAxis
                  tick={{
                    fontSize: 11,
                    fill: "#71717a",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<AnalyticsTooltip />}
                />

                <Line
                  type="monotone"
                  dataKey="tds"
                  name="TDS"
                  stroke="#0f766e"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>
      )}
    </div>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  unit,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex size-9 items-center justify-center rounded-xl bg-green-50">
          <Icon className="size-4 text-green-600" />
        </div>

      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-xl font-bold text-zinc-800">
          {value != null ? Number(value).toFixed(2) : "—"}
        </span>

        {unit && (
          <span className="text-xs font-medium text-zinc-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

const ChartCard = ({
  title,
  description,
  icon: Icon,
  children,
}) => {
  return (
    <div className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">

      <div className="mb-4 flex items-start gap-3">

        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-green-50">
          <Icon className="size-4 text-green-600" />
        </div>

        <div className="min-w-0">
          <h2 className="text-base font-semibold text-zinc-800">
            {title}
          </h2>

          <p className="mt-0.5 text-xs text-zinc-400">
            {description}
          </p>
        </div>

      </div>

      <div className="h-75 w-full min-w-0">
        {children}
      </div>
    </div>
  );
};

const AnalyticsTooltip = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-lg">

      <p className="mb-2 text-xs font-semibold text-zinc-700">
        {label}
      </p>

      <div className="space-y-1">

        {payload.map((item) => (
          <div
            key={item.dataKey}
            className="flex items-center justify-between gap-5"
          >
            <span className="text-xs text-zinc-500">
              {item.name}
            </span>

            <span className="text-xs font-semibold text-zinc-800">
              {Number(item.value).toFixed(2)}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

const LoadingCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="h-92.5 animate-pulse rounded-3xl border border-zinc-200 bg-zinc-50"
        />
      ))}

    </div>
  );
};

const EmptyAnalytics = () => {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-center">

      <Activity className="mx-auto size-8 text-zinc-300" />

      <h2 className="mt-4 text-sm font-semibold text-zinc-700">
        No analytics data
      </h2>

      <p className="mx-auto mt-1 max-w-md text-xs leading-relaxed text-zinc-400">
        There is no telemetry data available for the
        selected robot and time period.
      </p>

    </div>
  );
};


export default AnalyticsPage;