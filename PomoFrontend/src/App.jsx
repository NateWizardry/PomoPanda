// App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Pomodoro from "./pages/Pomodoro";
import Timetable from "./pages/Timetable";
import Notes from "./pages/Notes";
import Todo from "./pages/Todo";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // import the wrapper

export default function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="pomodoro" element={<Pomodoro />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="notes" element={<Notes userId={userId} />} />
        <Route path="todo" element={<Todo />} />
      </Route>

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
