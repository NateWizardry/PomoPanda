import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Todo() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pomo_tasks") || "[]");
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("All");
  const [categories, setCategories] = useState([
    { name: "Assignments", color: "bg-emerald-500" },
    { name: "Deadlines", color: "bg-red-500" },
    { name: "Personal", color: "bg-blue-500" },
  ]);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    localStorage.setItem("pomo_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;
    setTasks((s) => [
      { id: Date.now(), text: text.trim(), done: false, category: "General" },
      ...s,
    ]);
    setText("");
  };

  const toggle = (id) =>
    setTasks((s) =>
      s.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  const remove = (id) => setTasks((s) => s.filter((t) => t.id !== id));

  const completed = tasks.filter((t) => t.done).length;
  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const filters = ["All", "Pending", "Completed", ...categories.map((c) => c.name)];
  const filteredTasks = tasks.filter((t) => {
    if (filter === "All") return true;
    if (filter === "Pending") return !t.done;
    if (filter === "Completed") return t.done;
    return t.category === filter;
  });

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories((s) => [
      ...s,
      { name: newCategory.trim(), color: "bg-slate-500" },
    ]);
    setNewCategory("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-8">To-Do Manager</h1>

      <div className="flex flex-1 gap-8">
        {/* Main Content */}
        <main className="flex-1 space-y-8 overflow-y-auto">
          {/* Progress */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-slate-200">
                Progress Overview
              </h3>
              <span className="text-sm text-slate-400">
                {completed} of {tasks.length} tasks completed ({progress}%)
              </span>
            </div>
            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
            <h3 className="text-base font-semibold text-slate-300 mb-4">Filters</h3>
            <div className="flex flex-wrap gap-3">
              {filters.map((f) => {
                const count =
                  f === "All"
                    ? tasks.length
                    : f === "Pending"
                    ? tasks.filter((t) => !t.done).length
                    : f === "Completed"
                    ? tasks.filter((t) => t.done).length
                    : tasks.filter((t) => t.category === f).length;
                return (
                  <motion.button
                    key={f}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg text-sm transition ${
                      filter === f
                        ? "bg-emerald-500/10 border border-emerald-500/40 text-emerald-400"
                        : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {f} <span className="ml-1 text-xs">({count})</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Add Task */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
            <div className="flex gap-3">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={addTask}
                className="px-6 py-3 rounded-lg font-semibold text-slate-50 bg-emerald-600 hover:bg-emerald-500 transition"
              >
                Add
              </motion.button>
            </div>
          </div>

          {/* Task List */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
            {filteredTasks.length === 0 ? (
              <div className="p-16 text-center border border-dashed border-slate-700 rounded-xl text-slate-500">
                <p>No tasks yet — time to get organized ✦</p>
                <p className="mt-2 text-emerald-500 font-medium">
                  + Add your first task
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredTasks.map((t, i) => (
                    <motion.li
                      key={t.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="group p-5 rounded-xl border border-slate-800 bg-slate-950 hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10 transition"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={t.done}
                            onChange={() => toggle(t.id)}
                            className="w-5 h-5 accent-emerald-500"
                          />
                          <span
                            className={`${
                              t.done
                                ? "line-through text-slate-500"
                                : "text-slate-200 font-medium"
                            }`}
                          >
                            {t.text}
                          </span>
                        </label>
                        <button
                          onClick={() => remove(t.id)}
                          className="text-slate-600 hover:text-red-500 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                      <span className="text-xs text-slate-500">{t.category}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 border-l border-slate-800 p-8 flex flex-col gap-4">
          {/* Categories */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-slate-200">Categories</h3>
            <p className="text-sm text-slate-400 mb-4">
              Organize your tasks by category
            </p>
            <ul className="space-y-3">
              {categories.map((c, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${c.color} inline-block`}></span>
                  <span className="text-slate-300">{c.name}</span>
                </li>
              ))}
            </ul>
            <div className="flex gap-2 mt-4">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm"
              />
              <button
                onClick={addCategory}
                className="px-4 py-2 rounded-lg text-xs bg-slate-800 hover:bg-slate-700"
              >
                +
              </button>
            </div>
          </div>

          {/* Daily Motivation */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-slate-800 shadow"
          >
            <h4 className="text-sm font-semibold text-emerald-400 mb-2">
              Daily Motivation
            </h4>
            <p className="text-slate-300 text-sm italic">
              “Small steps every day lead to big changes.”
            </p>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
