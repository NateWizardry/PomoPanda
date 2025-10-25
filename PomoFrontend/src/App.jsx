// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // import Navigate

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Pomodoro from "./pages/Pomodoro";
import Timetable from "./pages/Timetable";
import Notes from "./pages/Notes";
import Todo from "./pages/Todo";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      {/* Default route "/" redirects to /login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login Page (no layout) */}
      <Route path="/login" element={<Login />} />

      {/* All pages under Layout */}
      <Route path="/app" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="pomodoro" element={<Pomodoro />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="notes" element={<Notes />} />
        <Route path="todo" element={<Todo />} />
      </Route>

      {/* Fallback 404 */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-slate-300 text-xl">
            404 — Page Not Found
          </div>
        }
      />
    </Routes>
  );
}
