import { useEffect, useState } from "react";
import api from "../api/axios";
import TelemetryHistory from "../components/TelemetryHistory";
import Spinner from "../components/Spinner";

const TelemetryHistoryPage = () => {
  const [robots, setRobots] = useState([]);
  const [selectedRobotId, setSelectedRobotId] = useState("");
  const [selectedRobotName, setSelectedRobotName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const res = await api.get("/robot/");
        const fetchedRobots = res.data.robots || [];
        setRobots(fetchedRobots);
        if (fetchedRobots.length > 0) {
          setSelectedRobotId(fetchedRobots[0].robotId);
          setSelectedRobotName(fetchedRobots[0].name);
        }
      } catch (error) {
        console.error("Failed to fetch robots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRobots();
  }, []);

  if (loading) {
    return <Spinner/>;
  }

  if (robots.length === 0) {
    return (
      <div className="pt-18 pb-10 md:pl-20 ml-40 max-md:ml-0">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <p className="text-xl font-semibold text-zinc-800">
            No S.P.I.R.E. robots found
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Pair a S.P.I.R.E. robot to view telemetry history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-18 pb-10 md:pl-20 ml-40 max-md:ml-0">

      {/* Header */}
      {/* <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> */}
        {/* <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Telemetry History
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Review historical telemetry records from your S.P.I.R.E. robot.
          </p>
        </div> */}

        {/* <select
          value={selectedRobotId}
          onChange={(e) => setSelectedRobotId(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none sm:w-auto"
        >
          {robots.map((robot) => (
            <option
              key={robot._id}
              value={robot.robotId}
            >
              {robot.name} ({robot.robotId})
            </option>
          ))}
        </select> */}
      {/* </div> */}

      <TelemetryHistory robotId={selectedRobotId} robotName={selectedRobotName} />
    </div>
  );
};

export default TelemetryHistoryPage;
