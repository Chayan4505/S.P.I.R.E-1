import { useState, useEffect } from "react";
import { ArrowDown, ArrowDownLeft, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUp, ArrowUpLeft, ArrowUpRight, Bot, CircleStop, Gamepad2, Radio, } from "lucide-react";
import { useWebSocket } from "../context/WebSocketContext";
import api from "../api/axios";

const Controls = () => {
  const { sendRobotCommand, isConnected, robotStatusByRobot, } = useWebSocket();
  const [mode, setMode] = useState("MANUAL");
  const [activeCommand, setActiveCommand] = useState("STOP");
  const [speed, setSpeed] = useState(120);
  const [robotId, setRobotId] = useState("");
  const [robotLoading, setRobotLoading] = useState(true);
  const robotStatus = robotStatusByRobot[robotId];
  const robotOnline = robotStatus?.isOnline === true;

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const res = await api.get("/robot/");

        const robots =
          res.data.robots || [];

        if (robots.length > 0) {
          setRobotId(
            robots[0].robotId
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch robots:",
          error
        );
      } finally {
        setRobotLoading(false);
      }
    };

    fetchRobots();
  }, []);

  const sendCommand = (command) => {
    if (!robotId) {
      return;
    }

    if (!isConnected) {
      return;
    }

    const sent = sendRobotCommand({
      robotId,
      command,
    });

    if (sent) {
      setActiveCommand(command);
    }
  };

  const handleModeChange = (newMode) => {
    if (!robotId || !isConnected) {
      return;
    }

    const command =
      newMode === "AUTO"
        ? "AUTO_MODE"
        : "MANUAL_MODE";

    const sent = sendRobotCommand({
      robotId,
      command,
    });

    if (!sent) {
      return;
    }

    setMode(newMode);
    setActiveCommand(command);
  };

  const handleSpeedChange = (newSpeed) => {
    const value = Number(newSpeed);

    setSpeed(value);

    if (!robotId || !isConnected || mode === "AUTO") {
      return;
    }

    sendRobotCommand({
      robotId,
      command: "SPEED",
      value,
    });
  };

  return (
    <div className="pt-18 pb-10 md:pl-20 ml-40 max-md:ml-0 mt-5">
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <Gamepad2 className="size-6 text-green-600" />

          <p className="text-2xl font-semibold tracking-tight text-zinc-900">
            S.P.I.R.E. Controls
          </p>
        </div>

        <p className="mt-1 text-sm text-zinc-500">
          Control and operate your S.P.I.R.E. robot.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">

        {/* LEFT — CONTROLLER */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-8">

          {/* Robot status */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                Active Robot
              </p>

              <div className="mt-1 flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-green-50">
                  <Bot className="size-4 text-green-600" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-green-500" />
                    <span className="text-[11px] text-zinc-400">
                      Connected
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current command */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-2.5 text-right">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                Command
              </p>

              <p className="mt-0.5 text-sm font-bold text-zinc-800">
                {activeCommand}
              </p>
            </div>
          </div>

          <div className="mx-auto mb-8 max-w-md">
            <div className="rounded-2xl bg-zinc-100 p-1.5">
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleModeChange("MANUAL")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${mode === "MANUAL"
                    ? "bg-white text-green-700 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                    }`}
                >
                  <Gamepad2 className="size-4" />
                  Manual
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange("AUTO")}
                  className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${mode === "AUTO"
                    ? "bg-green-600 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                    }`}
                >
                  <Bot className="size-4" />
                  Autonomous
                </button>

              </div>
            </div>
          </div>

          <div className="mx-auto w-full max-w-107.5">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {/* TOP LEFT */}
              <ControlButton
                command="FORWARD_LEFT"
                onClick={sendCommand}
                disabled={mode === "AUTO" || !isConnected || !robotOnline}
              >
                <ArrowUpLeft />
              </ControlButton>

              {/* FORWARD */}
              <ControlButton
                command="FORWARD"
                onClick={sendCommand}
                disabled={mode === "AUTO" || !isConnected || !robotOnline}
              >
                <ArrowUp />
              </ControlButton>

              {/* TOP RIGHT */}
              <ControlButton
                command="FORWARD_RIGHT"
                onClick={sendCommand}
                disabled={mode === "AUTO" || !isConnected || !robotOnline}
              >
                <ArrowUpRight />
              </ControlButton>

              {/* LEFT */}
              <ControlButton
                command="LEFT"
                onClick={sendCommand}
                disabled={mode === "AUTO" || !isConnected || !robotOnline}
              >
                <ArrowLeft />
              </ControlButton>

              {/* STOP */}
              <button
                type="button"
                onClick={() => sendCommand("STOP")}
                className="flex aspect-square items-center justify-center rounded-[28%] bg-red-500 text-white shadow-lg shadow-red-500/20 transition-all hover:bg-red-600 active:scale-95"
                aria-label="Stop robot"
              >
                <div className="flex flex-col items-center gap-1">
                  <CircleStop className="size-10 sm:size-12" />

                  <span className="text-[10px] font-bold tracking-wider">
                    STOP
                  </span>
                </div>
              </button>

              {/* RIGHT */}
              <ControlButton
                command="RIGHT"
                onClick={sendCommand}
                disabled={mode === "AUTO" || !isConnected || !robotOnline}
              >
                <ArrowRight />
              </ControlButton>

              {/* BOTTOM LEFT */}
              <ControlButton
                command="BACKWARD_LEFT"
                onClick={sendCommand}
                disabled={mode === "AUTO" || !isConnected || !robotOnline}
              >
                <ArrowDownLeft />
              </ControlButton>

              {/* BACKWARD */}
              <ControlButton
                command="BACKWARD"
                onClick={sendCommand}
                disabled={mode === "AUTO" || !isConnected || !robotOnline}
              >
                <ArrowDown />
              </ControlButton>

              {/* BOTTOM RIGHT */}
              <ControlButton
                command="BACKWARD_RIGHT"
                onClick={sendCommand}
                disabled={mode === "AUTO" || !isConnected || !robotOnline}
              >
                <ArrowDownRight />
              </ControlButton>

            </div>
          </div>

          {/* Control hint */}
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-zinc-400">
            <Radio className="size-3.5" />

            <span>
              {mode === "MANUAL"
                ? "Manual control active"
                : "Autonomous control active"}
            </span>
          </div>
        </div>

        <div className="space-y-4">

          {/* Mode */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-green-50">
                {mode === "AUTO" ? (
                  <Bot className="size-5 text-green-600" />
                ) : (
                  <Gamepad2 className="size-5 text-green-600" />
                )}
              </div>

              <div>
                <p className="text-xs text-zinc-400">
                  Current Mode
                </p>

                <p className="mt-0.5 font-semibold text-zinc-800">
                  {mode === "AUTO"
                    ? "Autonomous"
                    : "Manual"}
                </p>
              </div>
            </div>
          </div>

          {/* Current command */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              Current Command
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-lg font-bold text-zinc-800">
                {activeCommand}
              </span>

              <div className="flex size-11 items-center justify-center rounded-xl bg-zinc-50">
                <Radio className="size-5 text-green-600" />
              </div>
            </div>
          </div>

          {/* Speed */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Motor Speed
                </p>

                <p className="mt-1 font-semibold text-zinc-800">
                  Manual Speed
                </p>
              </div>

              <div className="rounded-xl bg-green-50 px-3 py-1.5">
                <span className="text-sm font-bold text-green-700">
                  {speed}
                </span>
              </div>
            </div>

            <div className="mt-5">
              <input
                type="range"
                min="0"
                max="255"
                value={speed}
                onChange={(e) => handleSpeedChange(e.target.value)}
                disabled={mode === "AUTO" || !isConnected}
                className="
                w-full
                cursor-pointer
                accent-green-600
                disabled:cursor-not-allowed
                disabled:opacity-40
            "
              />

              <div className="mt-2 flex justify-between text-[10px] font-medium text-zinc-400">
                <span>0</span>
                <span>255</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Connection
                </p>

                <p className="mt-1 font-semibold text-zinc-800">
                  WebSocket
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${isConnected
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
                  }`}
              >
                <span
                  className={`size-1.5 rounded-full ${isConnected
                    ? "bg-green-500"
                    : "bg-red-500"
                    }`}
                />

                {isConnected
                  ? "Connected"
                  : "Disconnected"}
              </span>
            </div>
          </div>

          {/* Safety */}
          <div className="rounded-3xl border border-red-100 bg-red-50/60 p-5">
            <div className="flex gap-3">
              <CircleStop className="mt-0.5 size-5 shrink-0 text-red-500" />

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Emergency Stop
                </p>

                <p className="mt-1 text-xs leading-relaxed text-red-600/80">
                  Press STOP immediately if the robot needs to halt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlButton = ({
  command,
  onClick,
  children,
  disabled,
}) => {
  return (
    <button
      type="button"
      onClick={() => onClick(command)}
      disabled={disabled}
      aria-label={command}
      className="group flex aspect-square items-center justify-center rounded-[28%] border border-zinc-200 bg-zinc-50 text-zinc-700 shadow-sm transition-all hover:border-green-200 hover:bg-green-50 hover:text-green-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-zinc-200 disabled:hover:bg-zinc-50 disabled:hover:text-zinc-700"
    >
      <div className="transition-transform duration-150 group-hover:scale-110">
        {children}
      </div>
    </button>
  );
};

export default Controls;