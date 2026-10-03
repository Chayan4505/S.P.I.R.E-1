import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  Bot,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import api from "../api/axios";

const PairRobotModal = ({ onClose }) => {
  const [pendingRobots, setPendingRobots] = useState([]);
  const [selectedRobotId, setSelectedRobotId] = useState("");
  const [robotName, setRobotName] = useState("");
  const [pairCode, setPairCode] = useState("");
  const [loadingRobots, setLoadingRobots] = useState(true);
  const [pairing, setPairing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch pending robots whenever modal opens
  useEffect(() => {
    const fetchPendingRobots = async () => {
      try {
        setLoadingRobots(true);
        setError("");

        const res = await api.get("/robot/pending");

        if (res.data.success) {
          setPendingRobots(res.data.robots || []);
        } else {
          setError("Unable to load available robots.");
        }
      } catch (err) {
        console.error("Failed to fetch pending robots:", err);
        setError(
          err.response?.data?.message ||
          "Failed to load available robots."
        );
      } finally {
        setLoadingRobots(false);
      }
    };

    fetchPendingRobots();
  }, []);

  // Prevent background scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Pair robot
  const handlePairRobot = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!selectedRobotId) {
      setError("Please select a robot.");
      return;
    }

    if (!robotName.trim()) {
      setError("Please enter a name for your robot.");
      return;
    }

    if (!pairCode.trim()) {
      setError("Please enter the pair code.");
      return;
    }

    try {
      setPairing(true);

      const res = await api.post("/robot/pair", {
        robotId: selectedRobotId,
        name: robotName.trim(),
        pairCode: pairCode.trim(),
      });

      if (res.data.success) {
        setSuccess("Robot paired successfully.");
        setTimeout(() => {
          window.location.reload();
          onClose();
        }, 1000);
      }
    } catch (err) {
      console.error("Robot pairing failed:", err);

      setError(
        err.response?.data?.message ||
        "Failed to pair robot."
      );
    } finally {
      setPairing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center">
                <Bot className="w-6 h-6 text-green-700" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-zinc-900">
                  Pair a Robot
                </h2>

                <p className="text-sm text-zinc-500">
                  Connect your S.P.I.R.E. robot
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-zinc-100 transition cursor-pointer"
            >
              <X className="w-5 h-5 text-zinc-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handlePairRobot} className="p-6 space-y-5">

            {/* Robot ID */}
            <div>
              <label className="block text-sm font-medium text-zinc-800 mb-2">
                Select Robot
              </label>

              {loadingRobots ? (
                <div className="h-12 rounded-xl border border-zinc-300 flex items-center justify-center gap-2 text-sm text-zinc-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading available robots...
                </div>
              ) : pendingRobots.length === 0 ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  No pending robots are currently available for pairing.
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedRobotId}
                    onChange={(e) => setSelectedRobotId(e.target.value)}
                    className="w-full h-12 appearance-none rounded-xl border border-zinc-300 bg-white px-4 pr-10 text-sm text-zinc-800 cursor-pointer focus:outline-none focus:ring-0 focus:border-green-600"
                  >
                    <option value="">
                      Select your Robot ID
                    </option>

                    {pendingRobots.map((robot) => (
                      <option
                        key={robot._id || robot.robotId}
                        value={robot.robotId}
                      >
                        {robot.robotId}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                </div>
              )}
            </div>

            {/* Robot Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-800 mb-2">
                Robot Name
              </label>

              <input
                type="text"
                value={robotName}
                onChange={(e) => setRobotName(e.target.value)}
                placeholder="e.g. My S.P.I.R.E."
                className="w-full h-12 rounded-xl border border-zinc-300 px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-0 focus:border-green-600"
              />
            </div>

            {/* Pair Code */}
            <div className="relative">
              <label className="block text-sm font-medium text-zinc-800 mb-2">
                Pair Code
              </label>

              <input
                type={showPassword ? "text" : "password"}
                value={pairCode}
                onChange={(e) => setPairCode(e.target.value)}
                placeholder="Enter robot pair code"
                autoComplete="off"
                className="w-full h-12 rounded-xl border border-zinc-300 px-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-0 focus:border-green-600"
              />
              <span
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3 top-10.5 cursor-pointer text-gray-500 py-0.5"
              >
                {showPassword ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </span>

              <p className="mt-2 text-xs text-zinc-500">
                Enter the pair code provided by your S.P.I.R.E. robot.
              </p>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Success */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{success}</span>
              </motion.div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={pairing}
                className="px-5 py-2.5 rounded-full border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  pairing ||
                  loadingRobots ||
                  pendingRobots.length === 0
                }
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium text-white bg-linear-to-br from-green-500 to-green-700 hover:opacity-90 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {pairing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Pairing...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    Pair Robot
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PairRobotModal;