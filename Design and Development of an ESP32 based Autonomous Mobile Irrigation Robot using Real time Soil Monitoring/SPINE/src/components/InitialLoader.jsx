import { useEffect, useState } from "react";

const letters = ["S", ".", "P", ".", "I", ".", "R", ".", "E", "."];

const InitialLoader = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);

      // Give the fade-out animation a moment to finish
      setTimeout(() => {
        onComplete();
      }, 500);
    }, 4500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) {
    return (
      <div className="fixed inset-0 z-100 bg-white animate-loader-fade-out" />
    );
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden bg-white">

      {/* Background glow */}
      <div className="absolute w-96 h-96 rounded-full bg-green-400/10 blur-3xl animate-pulse" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#166534 1px, transparent 1px), linear-gradient(90deg, #166534 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        <span className="absolute top-[25%] left-[20%] w-1 h-1 rounded-full bg-green-500/40 animate-float" />
        <span className="absolute top-[35%] right-[23%] w-1.5 h-1.5 rounded-full bg-green-400/30 animate-float-delayed" />
        <span className="absolute bottom-[30%] left-[28%] w-1 h-1 rounded-full bg-green-600/30 animate-float-slow" />
        <span className="absolute bottom-[25%] right-[30%] w-1 h-1 rounded-full bg-green-500/40 animate-float-delayed" />
      </div>

      {/* Main loader */}
      <div className="relative flex flex-col items-center">

        {/* Outer ring */}
        <div className="absolute w-72 h-72 max-md:w-60 max-md:h-60 rounded-full border border-green-500/10 animate-spin-slow" />

        {/* Inner dashed ring */}
        <div className="absolute w-60 h-60 max-md:w-48 max-md:h-48 rounded-full border border-dashed border-green-500/20 animate-spin-reverse" />

        {/* Corner indicators */}
        <div className="absolute -top-8 -left-8 w-4 h-4 border-t-2 border-l-2 border-green-500/60" />
        <div className="absolute -top-8 -right-8 w-4 h-4 border-t-2 border-r-2 border-green-500/60" />
        <div className="absolute -bottom-8 -left-8 w-4 h-4 border-b-2 border-l-2 border-green-500/60" />
        <div className="absolute -bottom-8 -right-8 w-4 h-4 border-b-2 border-r-2 border-green-500/60" />

        {/* S.P.I.R.E. */}
        <div className="relative flex items-center text-7xl max-md:text-5xl font-black tracking-tight">
          {letters.map((char, i) => (
            <span
              key={i}
              className={`
                relative mx-px
                ${char === "." ? "text-green-400" : "text-green-600"}
                animate-spine-wave
              `}
              style={{
                animationDelay: `${i * 0.09}s`,
              }}
            >
              {char}
            </span>
          ))}

          {/* Scanning line */}
          <span className="absolute left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-green-400 to-transparent animate-scan" />
        </div>

        {/* Subtitle */}
        <div className="mt-7 flex items-center gap-3">
          <span className="h-px w-8 bg-green-500/30" />

          <span className="text-[10px] tracking-[0.35em] font-semibold text-green-700/60">
            INITIALIZING SYSTEM
          </span>

          <span className="h-px w-8 bg-green-500/30" />
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-green-500 animate-loading-dot"
              style={{
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InitialLoader;