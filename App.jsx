import React, { useState, useEffect } from "react";

const emojiFor = (txt) => {
  const t = txt.toLowerCase();
  if (t.includes("bath")) return "🛁";
  if (t.includes("study")) return "📚";
  if (t.includes("eat")) return "🍕";
  if (t.includes("sleep")) return "😴";
  if (t.includes("gym")) return "💪";
  return "✨";
};

const fmtTime = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function App() {
  const [now, setNow] = useState(new Date());
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const t = text.trim();
    if (!t) return;
    const newTask = {
      text: t,
      done: false,
      created: new Date().toISOString(),
      sched: time || null,
    };
    setTasks([...tasks, newTask]);
    setText("");
    setTime("");
  };

  const toggleDone = (i) => {
    const updated = [...tasks];
    updated[i].done = !updated[i].done;
    setTasks(updated);
  };

  const remove = (i) => {
    setTasks(tasks.filter((_, idx) => idx !== i));
  };

  const sorted = [...tasks].sort((a, b) => {
    if (!a.sched) return 1;
    if (!b.sched) return -1;
    return a.sched.localeCompare(b.sched);
  });

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-pink-100 to-pink-300 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-pink-300">
        <div className="text-center mb-6">
          <p className="text-pink-600 font-semibold text-lg tracking-wide">Current Time</p>
          <h2 className="text-4xl font-extrabold text-pink-700 drop-shadow-md">{now.toLocaleTimeString()}</h2>
        </div>
        <h1 className="text-4xl font-bold text-pink-600 text-center mb-8 select-none">💖 Laya's To-Do List 💖</h1>
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            className="flex-grow p-3 border border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
            placeholder="✨ Add a cute task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <input
            type="time"
            className="w-24 p-3 border border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            aria-label="Select time for the task"
          />
          <button
            onClick={addTask}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-2xl font-semibold shadow-md transition-transform active:scale-95"
            aria-label="Add task"
          >
            ➕
          </button>
        </div>
        <ul className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-pink-100">
          {tasks.length === 0 && (
            <p className="text-center text-pink-400 italic select-none">No tasks yet! Add something cute ✨</p>
          )}
          {sorted.map((task, i) => (
            <li
              key={i}
              className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div
                onClick={() => toggleDone(i)}
                className={`cursor-pointer flex-1 select-none flex items-center gap-3 ${
                  task.done ? "line-through text-pink-400" : "text-pink-800"
                }`}
                title="Click to toggle done"
              >
                <span className="text-2xl">{task.done ? "✅" : emojiFor(task.text)}</span>
                <div>
                  <p className="font-medium">
                    {task.text}{" "}
                    {task.sched && <span className="text-xs text-pink-500 ml-2 font-semibold">⏰ {task.sched}</span>}
                  </p>
                  <p className="text-xs text-pink-400">Added at {fmtTime(new Date(task.created))}</p>
                </div>
              </div>
              <button
                onClick={() => remove(i)}
                className="text-red-500 hover:text-red-700 text-2xl transition-colors"
                aria-label={`Remove task: ${task.text}`}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
