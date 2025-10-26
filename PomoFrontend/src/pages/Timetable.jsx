import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, BookOpen, Palette } from "lucide-react";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 12 }).map((_, i) => `${i + 6}:00`);

const BACKEND_URL = "http://localhost:5000";

export default function Timetable() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const userId = user?.id;

  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    day: "Mon",
    hour: "9:00",
    subject: "Study Time",
    color: "#60a5fa",
  });

  // Fetch events from backend
  useEffect(() => {
    if (!userId) return;

    fetch(`${BACKEND_URL}/api/timetable/${userId}`)
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Error fetching timetable events:", err));
  }, [userId]);

  // Add new event
  function addEvent(e) {
    e.preventDefault();
    if (!userId) return;

    const newEventData = { ...form, userId };

    fetch(`${BACKEND_URL}/api/timetable`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEventData),
    })
      .then((res) => res.json())
      .then((savedEvent) => {
        setEvents((s) => [...s, savedEvent]);
        setForm({
          title: "",
          day: "Mon",
          hour: "9:00",
          subject: "Study Time",
          color: "#60a5fa",
        });
        setOpen(false);
      })
      .catch((err) => console.error("Error adding event:", err));
  }

  // Delete event
  function removeEvent(id) {
    fetch(`${BACKEND_URL}/api/timetable/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => setEvents((s) => s.filter((ev) => ev.id !== id)))
      .catch((err) => console.error("Error deleting event:", err));
  }

  const today = DAYS[new Date().getDay() - 1] || "Mon";
  const todayClasses = events.filter((ev) => ev.day === today);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-2xl font-bold mb-10">Timetable</h1>

      <div className="flex flex-col lg:flex-row justify-center gap-8">
        <div className="flex-1 max-w-[900px]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-200">
              <Calendar size={20} className="text-emerald-400" />
              Weekly Schedule
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black font-semibold shadow hover:bg-gray-100 transition"
            >
              <Plus size={16} /> Add Event
            </button>
          </div>

          <section className="bg-[rgba(255,255,255,0.03)] border border-slate-800 rounded-2xl p-4 shadow-lg overflow-auto">
            <div className="grid grid-cols-8 gap-1 text-center">
              <div className="p-2 bg-gradient-to-b from-slate-800 to-slate-700 font-semibold text-sm">Time</div>
              {DAYS.map((d) => (
                <div key={d} className="p-2 bg-gradient-to-b from-slate-800 to-slate-700 font-semibold text-sm">{d}</div>
              ))}

              {HOURS.map((h) => (
                <React.Fragment key={h}>
                  <div className="p-2 text-slate-400 text-sm bg-slate-900 font-medium">{h}</div>
                  {DAYS.map((d) => {
                    const cellEvents = events.filter((ev) => ev.day === d && ev.hour === h);
                    return (
                      <div
                        key={d + h}
                        className="min-h-[56px] rounded-lg border border-slate-800 bg-[rgba(0,0,0,0.25)] p-1 flex flex-col gap-1 hover:border-emerald-500/40 transition text-xs"
                      >
                        {cellEvents.length === 0 && (
                          <div className="flex-1 flex items-center justify-center text-slate-600 italic">–</div>
                        )}
                        {cellEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className="rounded-md p-1 flex items-start justify-between"
                            style={{
                              backgroundColor: ev.color + "33",
                              borderLeft: `3px solid ${ev.color}`,
                            }}
                          >
                            <div className="truncate">
                              <div className="font-semibold">{ev.title}</div>
                              <div className="text-slate-400 text-[10px]">{ev.subject}</div>
                            </div>
                            <button
                              onClick={() => removeEvent(ev.id)}
                              className="text-red-400 ml-1 text-xs hover:text-red-500 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-6 w-[280px]">
          <div className="bg-[rgba(255,255,255,0.03)] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
              <BookOpen size={18} className="text-green-400" />
              Today's Classes
            </div>
            <div className="space-y-2 text-xs">
              {todayClasses.length === 0 && <div className="text-slate-400 italic">No classes today</div>}
              {todayClasses.map((ev) => (
                <div
                  key={ev.id}
                  className="flex justify-between items-center bg-[rgba(255,255,255,0.1)] rounded-md p-1 px-2"
                  style={{ borderLeft: `3px solid ${ev.color}` }}
                >
                  <span className="truncate">{ev.title}</span>
                  <span className="text-slate-400 text-[10px]">{ev.hour}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.03)] border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold">
              <Palette size={18} className="text-blue-400" />
              Subjects
            </div>
            <div className="space-y-2">
              <SubjectBadge color="#10b981" name="Mathematics" />
              <SubjectBadge color="#60a5fa" name="Science" />
              <SubjectBadge color="#f97316" name="English" />
              <SubjectBadge color="#a78bfa" name="History" />
              <SubjectBadge color="#94a3b8" name="Study Time" />
            </div>
          </div>
        </aside>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <motion.form
            onSubmit={addEvent}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-50 bg-slate-900 rounded-2xl p-6 w-full max-w-md"
          >
            <h4 className="text-lg font-semibold mb-4">Add Event</h4>
            <div className="space-y-3">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 rounded bg-slate-800"
              />
              <div className="flex gap-2">
                <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="flex-1 p-2 rounded bg-slate-800">
                  {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={form.hour} onChange={(e) => setForm({ ...form, hour: e.target.value })} className="flex-1 p-2 rounded bg-slate-800">
                  {HOURS.map((h) => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="flex-1 p-2 rounded bg-slate-800" />
                <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-12 h-10 rounded" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded bg-slate-700">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 transition">Save</button>
              </div>
            </div>
          </motion.form>
        </div>
      )}
    </div>
  );
}

function SubjectBadge({ color, name }) {
  return (
    <div className="flex items-center gap-3 p-2 bg-[rgba(255,255,255,0.03)] rounded hover:bg-[rgba(255,255,255,0.06)] transition">
      <div style={{ background: color }} className="w-3 h-3 rounded-full" />
      <div className="text-sm truncate">{name}</div>
    </div>
  );
}
