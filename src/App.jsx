/**
 * App – Neo‑Minimalist Task Manager
 *
 * A single‑page task manager built with React and Tailwind CSS.
 * Manages a list of tasks (add, toggle, delete), supports filtering,
 * and automatically saves/loads tasks from localStorage.
 */
import { useState, useEffect } from "react";

const STORAGE_KEY = "neo-tasks";

function App() {
  // Lazy initialiser: reads saved tasks from localStorage on first render
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [newText, setNewText] = useState("");
  const [filter, setFilter] = useState("all"); // "all", "active", "completed"

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  /** Creates a new task object and adds it to the state */
  const addTask = () => {
    const text = newText.trim();
    if (!text) return;
    setTasks([
      ...tasks,
      { id: Date.now(), text, completed: false },
    ]);
    setNewText("");
  };

  /** Toggles the completed boolean of the task with the given id */
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  /** Removes the task with the given id from the state */
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Derives the filtered list based on the current filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true; // "all"
  });

  /** Allows pressing Enter to add a task */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTask();
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-lg shadow-neutral-200/50 border border-neutral-200 p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-neutral-800 mb-1">Your Day</h1>
        <p className="text-sm text-neutral-400 mb-8">
          {tasks.length === 0
            ? "No tasks yet – create one below."
            : `${tasks.filter((t) => !t.completed).length} active, ${tasks.filter((t) => t.completed).length} done`}
        </p>

        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="flex-1 border border-neutral-200 rounded-xl px-4 py-3 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow text-sm"
          />
          <button
            onClick={addTask}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-sm shadow-teal-200/40 text-sm"
          >
            Add
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {["all", "active", "completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                ${
                  filter === type
                    ? "bg-teal-100 text-teal-700"
                    : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="space-y-3">
          {filteredTasks.length === 0 ? (
            <li className="text-center py-12 text-neutral-400">
              {filter === "all"
                ? "No tasks yet – add one above!"
                : `No ${filter} tasks`}
            </li>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="group flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                {/* Custom checkbox using Tailwind's peer class – the real input is visually hidden */}
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="sr-only peer"
                  />
                  <div className="w-5 h-5 border-2 border-neutral-300 rounded-md peer-checked:bg-teal-600 peer-checked:border-teal-600 flex items-center justify-center transition-colors">
                    {task.completed && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </label>

                {/* Task text – click to toggle completion */}
                <span
                  onClick={() => toggleTask(task.id)}
                  className={`flex-1 cursor-pointer text-base transition-all ${
                    task.completed
                      ? "line-through text-neutral-400"
                      : "text-neutral-800"
                  }`}
                >
                  {task.text}
                </span>

                {/* Delete button – hidden until the row is hovered (group-hover) */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-neutral-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 ml-2"
                  title="Delete task"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;