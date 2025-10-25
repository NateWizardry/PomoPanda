import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Home, Clock, Calendar, StickyNote, CheckSquare } from "lucide-react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navbar */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 px-10 py-6 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 rounded-full p-2">🐼</div>
          <h1 className="text-2xl font-bold">PomoPanda</h1>
        </div>

        <nav className="flex flex-wrap gap-6 text-sm justify-end">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-emerald-400 transition"
          >
            <Home size={18} /> Dashboard
          </Link>
          <Link
            to="/pomodoro"
            className="flex items-center gap-1 hover:text-emerald-400 transition"
          >
            <Clock size={18} /> Pomodoro
          </Link>
          <Link
            to="/timetable"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <Calendar size={18} /> Timetable
          </Link>
          <Link
            to="/notes"
            className="flex items-center gap-1 hover:text-orange-400 transition"
          >
            <StickyNote size={18} /> Notes
          </Link>
          <Link
            to="/todo"
            className="flex items-center gap-1 hover:text-pink-400 transition"
          >
            <CheckSquare size={18} /> To-Do
          </Link>
        </nav>
      </header>

      {/* Main content area */}
      <main className="flex-1 p-10">
        {/* This is where each page will render its content */}
        <Outlet />
      </main>
    </div>
  );
}
