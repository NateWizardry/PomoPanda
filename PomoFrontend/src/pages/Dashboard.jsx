import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, Calendar, StickyNote, CheckSquare, Flame, Target } from "lucide-react";

export default function Dashboard() {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const quotes = [
    "Small progress each day adds up to big results.",
    "Stay focused and the rest will follow.",
    "Your only limit is your mind.",
    "Discipline beats motivation every time.",
  ];

  // Rotate quotes every 20s
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Example stats
  const tasksCompleted = 12;
  const totalTasks = 20;
  const progress = (tasksCompleted / totalTasks) * 100;

  const upcomingEvents = [
    { time: "10:00 AM", title: "Physics Class", type: "class", color: "blue" },
    { time: "2:00 PM", title: "Team Meeting", type: "work", color: "green" },
    { time: "6:00 PM", title: "Cricket Practice", type: "personal", color: "orange" },
  ];

  const cards = [
  {
    title: "Pomodoro",
    desc: "Focus sessions & productivity stats",
    link: "/app/pomodoro",
    color: "from-emerald-400 to-teal-400",
    icon: <Clock size={28} />,
  },
  {
    title: "Timetable",
    desc: "View your weekly schedule",
    link: "/app/timetable",
    color: "from-blue-400 to-indigo-400",
    icon: <Calendar size={28} />,
  },
  {
    title: "Notes",
    desc: "Quick access to your notes & ideas",
    link: "/app/notes",
    color: "from-orange-400 to-yellow-400",
    icon: <StickyNote size={28} />,
  },
  {
    title: "To-Do",
    desc: "Track tasks and progress",
    link: "/app/todo",
    color: "from-pink-400 to-rose-400",
    icon: <CheckSquare size={28} />,
  },
];


  return (
    <div className="flex flex-col gap-10">
      {/* Hero Section */}
      <div className="text-center">
        {/* CHANGED: welcome text color set to white (only change) */}
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Welcome Back, Ninja 🐼
        </h1>
        <motion.p
          key={quoteIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-2 text-slate-400 italic"
        >
          “{quotes[quoteIndex]}”
        </motion.p>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
            className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 cursor-pointer transition hover:border-white"
          >
            <Link to={card.link} className="flex flex-col items-center text-center">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-4`}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-200">{card.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{card.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center"
        >
          <Target className="mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-green-400">2h 30m</p>
          <p className="text-slate-400 text-sm mt-1">Focus Time Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center"
        >
          <CheckSquare className="mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold text-blue-400">{tasksCompleted}/{totalTasks}</p>
          <p className="text-slate-400 text-sm mt-1">Tasks Completed</p>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="bg-blue-500 h-2 rounded-full"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center"
        >
          <Flame className="mx-auto mb-2 text-orange-400 animate-pulse" />
          <p className="text-2xl font-bold text-orange-400">5</p>
          <p className="text-slate-400 text-sm mt-1">Day Streak</p>
        </motion.div>
      </div>

      {/* Upcoming Events - Timeline style */}
      <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 shadow-lg relative">
        <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
          Upcoming Events
          <button className="text-xs bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 transition">
            + Add
          </button>
        </h2>

        {/* vertical connector line */}
        <div className="absolute left-4 top-16 bottom-6 w-[2px] bg-gray-700" aria-hidden />

        <div className="mt-2 space-y-6">
          {upcomingEvents.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative pl-10"
            >
              {/* dot (aligned left of time) */}
              <div
                className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 border-gray-900`}
                style={{ backgroundColor: event.color }}
              />
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-400 min-w-[72px]">{event.time}</p>
                <div>
                  <p className="font-medium text-slate-200">{event.title}</p>
                  <span
                    className={`inline-block text-xs mt-1 px-2 py-0.5 rounded-full bg-${event.color}-500/20 text-${event.color}-400`}
                  >
                    {event.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
