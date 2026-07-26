"use client";

import { useEffect, useState } from "react";
import { getTasks, addTask, updateTask } from "@/services/tasks";
import { Task, TaskStatus } from "@/types/database";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setSubmitting(true);
      setErrorMsg(null);

      const newTask = await addTask(title.trim(), description.trim());

      setTasks((prev) => [newTask, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: TaskStatus) {
    try {
      setUpdatingId(id);
      setErrorMsg(null);

      const updated = await updateTask(id, { status: newStatus });

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t)),
      );
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto my-10 max-w-[600px] p-5 font-sans">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
        Task Manager
      </h1>
      <p className="mb-6 text-slate-500">Read, Create, and Update Operations</p>

      {/* Add Task Form */}
      <form
        onSubmit={handleCreate}
        className="mb-8 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4"
      >
        <h3 className="m-0 text-base font-semibold text-slate-900">
          Add New Task
        </h3>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title (required)"
          required
          className="rounded-md border border-slate-300 p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description (optional)"
          className="rounded-md border border-slate-300 p-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="self-start rounded-md bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? "Adding..." : "Add Task"}
        </button>
      </form>

      {errorMsg && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-2.5 text-red-800">
          {errorMsg}
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <p className="text-slate-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white bg-slate-50 p-6 text-center">
          <p className="m-0 text-slate-500">
            No tasks found. Use the form above to create one!
          </p>
        </div>
      ) : (
        <ul className="m-0 list-none space-y-2 p-0">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3"
            >
              <div className="min-w-0 flex-1">
                <strong
                  className={`font-semibold text-white ${
                    task.status === "done" ? "line-through text-white" : ""
                  }`}
                >
                  {task.title}
                </strong>
                {task.description && (
                  <p className="mt-1 text-sm text-white">{task.description}</p>
                )}
              </div>

              {/* Status Select Dropdown */}
              <select
                value={task.status}
                disabled={updatingId === task.id}
                onChange={(e) =>
                  handleStatusChange(task.id, e.target.value as TaskStatus)
                }
                className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none disabled:opacity-50"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
