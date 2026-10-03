import { useEffect, useState } from "react";
import LatestTelemetry from "../components/LatestTelemetry";
import api from "../api/axios";
import Spinner from "../components/Spinner";

const TelemetryPage = () => {
    const [robots, setRobots] = useState([]);
    const [selectedRobotId, setSelectedRobotId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRobots = async () => {
            try {
                const res = await api.get("/robot/");
                const fetchedRobots = res.data.robots || [];
                setRobots(fetchedRobots);
                // Select first robot automatically
                if (fetchedRobots.length > 0) {
                    setSelectedRobotId(fetchedRobots[0].robotId);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch robots:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRobots();
    }, []);

    if (loading) {
        return <Spinner />;
    }

    if (robots.length === 0) {
    return (
      <div className="pt-18 pb-10 md:pl-20 ml-40 max-md:ml-0">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6">
          <p className="text-xl font-semibold text-zinc-800">
            No S.P.I.R.E. robots found
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            Pair a S.P.I.R.E. robot to view telemetry.
          </p>
        </div>
      </div>
    );
  }

    return (
        <div>
            {/* <div className="flex items-center justify-between">
                <select
                    value={selectedRobotId}
                    onChange={(e) => setSelectedRobotId(e.target.value)}
                    className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm outline-none">
                    {robots.map((robot) => (
                        <option
                            key={robot._id}
                            value={robot.robotId}
                        >
                            {robot.name} ({robot.robotId})
                        </option>
                    ))}
                </select>
            </div> */}

            <LatestTelemetry robotId={selectedRobotId} />
        </div>
    );
};

export default TelemetryPage;