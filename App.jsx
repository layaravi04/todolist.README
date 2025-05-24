import React, { useState, useEffect } from "react";
function getCurrentWeekDates() {
  const today = new Date();
  const week = [];
  const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  for (let i = 0; i < 7; i++) {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    week.push(d);
  }
  return week;
}

const getEmojiForTask = (task) => {
  const text = task.toLowerCase();
  if (text.includes("bath")) return "🛁";
  if (text.includes("study")) return "📚";
  if (text.includes("eat")) return "🍕";
  if (text.includes("sleep")) return "😴";
  if (text.includes("gym")) return "💪";
  return "✨";
};

const priorityIcons = {
  high: "🔥",
  medium: "⭐",
  low: "🌿",
};
const priorityColors = {
  high: "text-red-600",
  medium: "text-yellow-600",
  low: "text-green-600",
};

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [priority, setPriority] = useState("medium");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString(),
      scheduledTime: scheduledTime || null,
      priority,
    };

    setTasks((prev) => [...prev, newTask]);
    setInput("");
    setScheduledTime("");
    setPriority("medium");
  };

  const toggleTaskDone = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const removeTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const sortedTasks = [...tasks].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    if (!a.scheduledTime) return 1;
    if (!b.scheduledTime) return -1;
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });

  // For date bar
  const weekDates = getCurrentWeekDates();
  const today = new Date();

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fbc2eb 0%, #f8d3e5 50%, #fbc2eb 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          padding: 32,
          borderRadius: 30,
          boxShadow:
            "6px 6px 16px #d1d9e6, -6px -6px 16px #ffffff",
          border: "1px solid #fbc2eb",
        }}
      >
        {/* Date bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 24,
            justifyContent: "space-between",
          }}
        >
          {/* Week days and dates */}
          <div style={{ display: "flex", gap: 8, flex: 1 }}>
            {weekDates.map((date, idx) => {
              const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 50,
                    borderRadius: 16,
                    background: isToday
                      ? "linear-gradient(135deg, #c084fc 0%, #a5b4fc 100%)"
                      : "transparent",
                    color: isToday ? "#fff" : "#be185d",
                    fontWeight: isToday ? 700 : 500,
                    fontSize: 15,
                    boxShadow: isToday
                      ? "0 2px 8px #c084fc33"
                      : "none",
                  }}
                >
                  <span style={{ opacity: 0.7, fontSize: 13 }}>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                      date.getDay()
                    ]}
                  </span>
                  <span style={{ fontSize: 18 }}>{date.getDate()}</span>
                </div>
              );
            })}
          </div>
          {/* Small current time on right */}
          <div
            style={{
              marginLeft: 16,
              color: "#be185d",
              fontWeight: 700,
              fontSize: 16,
              minWidth: 70,
              textAlign: "right",
            }}
          >
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#db2777",
            textAlign: "center",
            marginBottom: 32,
            userSelect: "none",
          }}
        >
          💖 Me+ To-Do List 💖
        </h1>

        {/* Input */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="✨ Add a cute task..."
            style={{
              padding: 12,
              border: "1px solid #fbc2eb",
              borderRadius: 16,
              outline: "none",
              fontSize: 16,
              marginBottom: 0,
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            aria-label="Task description"
          />

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              type="time"
              style={{
                width: 90,
                padding: 12,
                border: "1px solid #fbc2eb",
                borderRadius: 16,
                outline: "none",
                fontSize: 16,
              }}
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              aria-label="Select time for the task"
            />

            <select
              style={{
                padding: 12,
                border: "1px solid #fbc2eb",
                borderRadius: 16,
                outline: "none",
                fontSize: 16,
                color: "#db2777",
                fontWeight: 600,
              }}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              aria-label="Select task priority"
            >
              <option value="high">🔥 High</option>
              <option value="medium">⭐ Medium</option>
              <option value="low">🌿 Low</option>
            </select>

            <button
              onClick={handleAddTask}
              style={{
                background: "#ec4899",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: 16,
                fontWeight: 600,
                fontSize: 18,
                border: "none",
                boxShadow: "0 2px 6px #fbc2eb",
                cursor: "pointer",
                transition: "background .2s, transform .1s",
              }}
              aria-label="Add task"
            >
              ➕
            </button>
          </div>
        </div>

        {/* Task list */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, maxHeight: 400, overflowY: "auto" }}>
          {tasks.length === 0 && (
            <p style={{ textAlign: "center", color: "#f472b6", fontStyle: "italic", userSelect: "none" }}>
              No tasks yet! Add something cute ✨
            </p>
          )}

          {sortedTasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fdf2f8",
                padding: 16,
                borderRadius: 24,
                boxShadow:
                  "3px 3px 8px #d1d9e6, -3px -3px 8px #ffffff",
                marginBottom: 16,
                cursor: "pointer",
                gap: 12,
              }}
            >
              {/* Emoji */}
              <span
                style={{
                  fontSize: 26,
                  flexShrink: 0,
                  marginRight: 8,
                  cursor: "pointer",
                }}
                onClick={() => toggleTaskDone(task.id)}
                title="Click to toggle done"
              >
                {task.completed ? "✅" : getEmojiForTask(task.text)}
              </span>

              {/* Task text - flex-grow to take all available space */}
              <span
                style={{
                  fontWeight: 600,
                  userSelect: "text",
                  color: task.completed ? "#f472b6" : "#be185d",
                  textDecoration: task.completed ? "line-through" : "none",
                  fontSize: 18,
                  flexGrow: 1,
                  marginRight: 0,
                  cursor: "pointer",
                }}
                onClick={() => toggleTaskDone(task.id)}
              >
                {task.text}
              </span>

              {/* Time - spaced far right */}
              {task.scheduledTime && (
                <span
                  style={{
                    fontSize: 15,
                    color: "#db2777",
                    fontWeight: 600,
                    marginLeft: 48, // big space between text and time
                    flexShrink: 0,
                  }}
                >
                  {task.scheduledTime}
                </span>
              )}

              {/* Priority */}
              <span
                style={{
                  fontWeight: 600,
                  fontSize: 18,
                  marginLeft: 14,
                  color:
                    task.priority === "high"
                      ? "#dc2626"
                      : task.priority === "medium"
                      ? "#ca8a04"
                      : "#16a34a",
                  flexShrink: 0,
                }}
                title={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              >
                {priorityIcons[task.priority]}
              </span>

              {/* Delete */}
              <button
                onClick={() => removeTask(task.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#dc2626",
                  fontSize: 22,
                  marginLeft: 14,
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "color .2s",
                }}
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
