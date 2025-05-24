import React, { useState, useEffect } from "react";

// Returns an emoji based on the task content
const getEmojiForTask = (task) => {
  const text = task.toLowerCase();
  if (text.includes("bath")) return "🛁";
  if (text.includes("study")) return "📚";
  if (text.includes("eat")) return "🍕";
  if (text.includes("sleep")) return "😴";
  if (text.includes("gym")) return "💪";
  return "✨";
};

// Format date/time nicely
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function App() {
  // Current time state (updates every second)
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load tasks from local storage on initial render
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save tasks to local storage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add a new task with timestamp and scheduled time
  const handleAddTask = () => {
    const trimmed = input.trim();
    if (trimmed === "") return;

    const newEntry = {
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      scheduledTime: scheduledTime || null,
    };

    setTasks([...tasks, newEntry]);
    setInput("");
    setScheduledTime("");
  };

  // Toggle completion status
  const toggleTaskDone = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  // Remove a task
  const removeTask = (index) => {
    const filtered = tasks.filter((_, i) => i !== index);
    setTasks(filtered);
  };

  // Optional: sort tasks by scheduled time (tasks without scheduled time go last)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.scheduledTime) return 1;
    if (!b.scheduledTime) return -1;
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  return (
    <div className="min-h-screen bg-gradient-to-tr from-pink-200 via-pink-100 to-pink-300 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-pink-300">
        {/* Current time display */}
        <div className="text-center mb-6">
          <p className="text-pink-600 font-semibold text-lg tracking-wide">
            Current Time
          </p>
          <h2 className="text-4xl font-extrabold text-pink-700 drop-shadow-md">
            {currentTime.toLocaleTimeString()}
          </h2>
        </div>

        <h1 className="text-4xl font-bold text-pink-600 text-center mb-8 select-none">
          💖 Laya's To-Do List 💖
        </h1>

        <div className="flex gap-3 mb-6">
          <input
            type="text"
            className="flex-grow p-3 border border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
            placeholder="✨ Add a cute task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTask();
            }}
          />
          <input
            type="time"
            className="w-24 p-3 border border-pink-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            aria-label="Select time for the task"
          />
          <button
            onClick={handleAddTask}
            className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-2xl font-semibold shadow-md transition-transform active:scale-95"
            aria-label="Add task"
          >
            ➕
          </button>
        </div>

        <ul className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-pink-100">
          {tasks.length === 0 && (
            <p className="text-center text-pink-400 italic select-none">
              No tasks yet! Add something cute ✨
            </p>
          )}
          {sortedTasks.map((task, idx) => (
            <li
              key={idx}
              className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div
                onClick={() => toggleTaskDone(idx)}
                className={`cursor-pointer flex-1 select-none flex items-center gap-3 ${
                  task.completed
                    ? "line-through text-pink-400"
                    : "text-pink-800"
                }`}
                title="Click to toggle done"
              >
                <span className="text-2xl">
                  {task.completed ? "✅" : getEmojiForTask(task.text)}
                </span>
                <div>
                  <p className="font-medium">
                    {task.text}{" "}
                    {task.scheduledTime && (
                      <span className="text-xs text-pink-500 ml-2 font-semibold">
                        ⏰ {task.scheduledTime}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-pink-400">
                    Added at {formatTime(new Date(task.createdAt))}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeTask(idx)}
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

