// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom"; // no BrowserRouter

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Pomodoro from "./pages/Pomodoro";
import Timetable from "./pages/Timetable";
import Notes from "./pages/Notes";
import Todo from "./pages/Todo";

export default function App() {
  return (
    <Routes>
      {/* All pages use Layout */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="pomodoro" element={<Pomodoro />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="notes" element={<Notes />} />
        <Route path="todo" element={<Todo />} />
      </Route>

      {/* Optional: fallback route for 404 */}
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
