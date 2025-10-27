import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Settings, Play, Pause, RotateCcw } from "lucide-react";

const FOCUS_DEFAULT = 25 * 60;
const SHORT_BREAK = 5 * 60;
const LONG_BREAK = 15 * 60;

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

export default function Pomodoro() {
  const [seconds, setSeconds] = useState(FOCUS_DEFAULT);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState("focus");
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem("pomo_sessions") || 0));
  const intervalRef = useRef(null);
  const ringAnim = useAnimation();
  const barAnim = useAnimation();

  useEffect(() => {
    localStorage.setItem("pomo_sessions", String(sessions));
  }, [sessions]);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          if (mode === "focus") setSessions((n) => n + 1);
          if (mode === "focus") {
            setMode("short");
            setSeconds(SHORT_BREAK);
          } else {
            setMode("focus");
            setSeconds(FOCUS_DEFAULT);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  useEffect(() => {
    ringAnim.start({
      rotate: [0, 360],
      transition: { repeat: Infinity, ease: "linear", duration: 8 },
    });
    barAnim.start({
      backgroundPositionX: ["0%", "200%"],
      transition: { repeat: Infinity, ease: "linear", duration: 5 },
    });
  }, [ringAnim, barAnim]);

  const totalForMode = useMemo(
    () => (mode === "focus" ? FOCUS_DEFAULT : mode === "short" ? SHORT_BREAK : LONG_BREAK),
    [mode]
  );
  const progress = 1 - seconds / totalForMode;

  const start = () => {
    if (seconds <= 0) setSeconds(totalForMode);
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setMode("focus");
    setSeconds(FOCUS_DEFAULT);
  };

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col">
      {/* Uniform Page Title */}
      <h1 className="text-2xl font-bold mb-6">Pomodoro Timer</h1>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <section className="col-span-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-8 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div className="text-sm text-slate-400">Focus deeply. Rest mindfully.</div>
            <button className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800/40 text-slate-300 backdrop-blur-sm"><Settings /></button>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Circular Timer */}
            <div className="relative w-[260px] h-[260px]">
              <motion.svg width="260" height="260" viewBox="0 0 260 260" className="absolute" animate={ringAnim}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
                <g transform="translate(130,130)">
                  <circle r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
                  <motion.circle
                    r={radius}
                    stroke="url(#pg)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={dashOffset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ ease: "linear", duration: 0.2 }}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </g>
              </motion.svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-5xl font-extrabold font-mono text-white">{formatTime(seconds)}</div>
                <div className="mt-2 text-sm text-slate-400">{mode === "focus" ? "Focus Session" : mode === "short" ? "Short Break" : "Long Break"}</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-1">
              <div className="flex gap-3 items-center mb-4">
                {running ? (
                  <button onClick={pause} className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-black rounded-xl shadow"><Pause /> Pause</button>
                ) : (
                  <button onClick={start} className="flex items-center gap-2 px-5 py-3 bg-emerald-500 rounded-xl shadow"><Play /> Start</button>
                )}
                <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-xl border border-slate-700"><RotateCcw /> Reset</button>
                <div className="ml-4 text-sm text-slate-400">Session {sessions} completed</div>
              </div>

              {/* Linear Progress */}
              <div className="mt-4">
                <div className="text-sm text-slate-400 mb-2">Session Progress</div>
                <div className="w-full h-3 bg-slate-800/40 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${progress * 100}%` }}
                    transition={{ duration: 0.3, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
                  />
                </div>
                <div className="mt-2 text-xs text-slate-400">{Math.round(progress * 100)}% complete</div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <ControlButton label="Focus" active={mode === "focus"} onClick={() => { setMode("focus"); setSeconds(FOCUS_DEFAULT); }} />
                <ControlButton label="Short Break" active={mode === "short"} onClick={() => { setMode("short"); setSeconds(SHORT_BREAK); }} />
                <ControlButton label="Long Break" active={mode === "long"} onClick={() => { setMode("long"); setSeconds(LONG_BREAK); }} />
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <aside className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-sm backdrop-blur-md flex flex-col gap-6">
          <div>
            <h4 className="font-semibold text-white">Session Stats</h4>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <StatCard title="Total Sessions" value={sessions} color="emerald" />
              <StatCard title="Today Focus" value={"0h"} color="sky" />
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white">Zen Mode</h4>
            <p className="text-sm text-slate-400 mt-2">Soothing vibes to help you focus — ambient background + minimal UI.</p>
            <div className="mt-3 rounded-md overflow-hidden">
              <img src="/zen.png" alt="zen" className="w-full h-32 object-cover" />
            </div>
          </div>
        </aside>
      </motion.div>
    </div>
  );
}

function ControlButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-3 py-2 rounded-lg text-sm ${active ? "bg-slate-700/60 border border-slate-600 text-white backdrop-blur-sm" : "bg-transparent hover:bg-slate-800/30 text-slate-300"}`}>
      {label}
    </button>
  );
}

function StatCard({ title, value, color = "emerald" }) {
  const colorMap = { emerald: "text-emerald-400", sky: "text-sky-400", orange: "text-orange-400" };
  return (
    <div className="bg-slate-800/40 p-3 rounded-md flex items-center justify-between backdrop-blur-sm">
      <div className="text-sm text-slate-300">{title}</div>
      <div className={`text-xl font-bold ${colorMap[color]}`}>{value}</div>
    </div>
  );
}
