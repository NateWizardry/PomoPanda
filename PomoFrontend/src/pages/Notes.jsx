// Notes.jsx
import React, { useState, useEffect } from "react";
import { Trash, BookOpen, Folder, Lightbulb } from "lucide-react";

export default function Notes() {
  const API_URL = "http://localhost:5000/api/notes";

  const [notes, setNotes] = useState([]);
  const [activeFolder, setActiveFolder] = useState("All Notes");
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // ✅ Track current user

  const folders = [
    { name: "All Notes", color: "text-slate-200", icon: BookOpen },
    { name: "General", color: "text-green-400", icon: Folder },
    { name: "Study Notes", color: "text-blue-400", icon: Folder },
    { name: "Ideas", color: "text-yellow-400", icon: Lightbulb },
  ];

  // ✅ Get the latest user ID from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id);
    }
  }, []); // runs once on mount

  // ✅ Fetch notes whenever userId changes
  useEffect(() => {
    if (!userId) return;

    async function fetchNotes() {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/${userId}`);
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, [userId]); // ✅ refetch whenever userId changes

  // Save new note
  async function saveNote() {
    if (!newNote.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: activeFolder === "All Notes" ? "General" : activeFolder,
          content: newNote,
          userId, // ✅ always current
        }),
      });

      if (!res.ok) throw new Error("Failed to save note");
      const saved = await res.json();
      setNotes((prev) => [saved, ...prev]);
      setNewNote("");
    } catch (err) {
      console.error(err);
    }
  }

  async function removeNote(id) {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    const res = await fetch(`${API_URL}/${userId}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete note");

    setNotes((prev) => prev.filter((n) => n.id !== id));
  } catch (err) {
    console.error(err);
  }
}


  // Filter notes
  const filteredNotes =
    activeFolder === "All Notes"
      ? notes
      : notes.filter((n) => n.title === activeFolder);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-6">Notes & Ideas</h1>

      <div className="flex flex-1 gap-8">
        {/* Sidebar */}
        <aside className="w-72 flex-shrink-0 space-y-6">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Folders</h3>
            <ul className="space-y-1">
              {folders.map((f) => {
                const Icon = f.icon;
                const count =
                  f.name === "All Notes"
                    ? notes.length
                    : notes.filter((n) => n.title === f.name).length;
                return (
                  <li
                    key={f.name}
                    onClick={() => setActiveFolder(f.name)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition ${
                      activeFolder === f.name
                        ? "bg-slate-800 text-white"
                        : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={16} className={f.color} />
                      {f.name}
                    </span>
                    <span className="text-slate-500 text-xs">{count}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">{activeFolder}</h3>

            {loading ? (
              <div className="text-slate-500 text-sm">Loading notes...</div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-auto">
                {filteredNotes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-lg border border-slate-800 bg-slate-950 flex justify-between items-center hover:border-emerald-500/40 transition"
                  >
                    <div>
                      <div className="font-medium text-sm">{n.content}</div>
                      <div className="text-xs text-slate-500">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => removeNote(n.id)}
                      className="text-slate-500 hover:text-red-500 transition"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Editor */}
        <main className="flex-1">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold text-slate-200">New Note</h3>
              <select
                value={activeFolder}
                onChange={(e) => setActiveFolder(e.target.value)}
                className="px-3 py-2 rounded-md bg-slate-900 border border-slate-700 text-slate-200"
              >
                {folders
                  .filter((f) => f.name !== "All Notes")
                  .map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
              </select>
            </div>

            <textarea
              rows={12}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Start writing your note..."
              className="w-full p-3 mb-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={saveNote}
                className="px-4 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 transition"
              >
                Save
              </button>
              <button
                onClick={() => setNewNote("")}
                className="px-4 py-2 rounded-md border border-slate-700 text-slate-300 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
