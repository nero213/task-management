// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { addTask, getTasks, updateTask } from "@/services/tasks";
import { Task, TaskStatus } from "@/types/database";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  async function handleStatusChange(id: string, status: TaskStatus) {
    try {
      setUpdatingId(id);
      const updated = await updateTask(id, { status });

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: updated.status } : task,
        ),
      );
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setUpdatingId(null);
    }
  }

  function statusMeta(status: TaskStatus) {
    switch (status) {
      case "todo":
        return { label: "Open", color: "var(--status-open)" };
      case "in_progress":
        return { label: "Active", color: "var(--status-active)" };
      case "done":
        return { label: "Done", color: "var(--status-closed)" };
    }
  }

  const counts = {
    open: tasks.filter((t) => t.status === "todo").length,
    active: tasks.filter((t) => t.status === "in_progress").length,
    closed: tasks.filter((t) => t.status === "done").length,
  };

  return (
    <main className="min-h-screen px-6 py-14">
      <div className="mx-auto max-w-3xl">
        {/* Masthead */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
          <div>
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-ink-faint">
              Dispatch Log
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
              Task Manager
            </h1>
          </div>

          <div className="flex gap-4 font-mono text-xs uppercase tracking-wider text-ink-dim">
            <span>
              <span className="text-ink">{counts.open}</span> Open
            </span>
            <span style={{ color: "var(--status-active)" }}>
              {counts.active} Active
            </span>
            <span>
              <span className="text-ink">{counts.closed}</span> Closed
            </span>
          </div>
        </div>

        {/* Intake form */}
        <div className="mb-10 rounded-md border border-line bg-panel p-6">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
            New Ticket
          </p>

          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="What needs doing?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border-b border-line bg-transparent px-1 py-2 text-ink placeholder:text-ink-faint outline-none transition focus:border-[var(--status-active)]"
            />

            <textarea
              rows={3}
              placeholder="Notes (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full resize-none border-b border-line bg-transparent px-1 py-2 text-sm text-ink placeholder:text-ink-faint outline-none transition focus:border-[var(--status-active)]"
            />

            <button
              disabled={!title.trim() || submitting}
              className="rounded-sm border border-line px-5 py-2 font-mono text-xs uppercase tracking-wider text-ink transition hover:border-[var(--status-active)] hover:text-[var(--status-active)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? "Filing…" : "Create"}
            </button>
          </form>
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-8 border-l-2 border-red-500 bg-panel px-4 py-3 font-mono text-xs text-red-400">
            {errorMsg}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-20 font-mono text-xs uppercase tracking-widest text-ink-faint">
            {/* <span>Printing</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span> */}
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-md border border-dashed border-line py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
              — No Open Tickets —
            </p>
            <p className="mt-2 text-sm text-ink-dim">
              File one above to get started.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, index) => {
              const meta = statusMeta(task.status);

              return (
                <div
                  key={task.id}
                  className="ticket rounded-md border border-line bg-panel py-5 pr-5 transition hover:border-ink-faint hover:bg-panel-raised"
                >
                  <span className="ticket-notch ticket-notch--top" />
                  <span className="ticket-notch ticket-notch--bottom" />

                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <p className="mb-1 font-mono text-[0.65rem] tracking-wider text-ink-faint">
                        No. {String(index + 1).padStart(3, "0")}
                      </p>

                      <h3
                        className={`text-lg font-medium ${
                          task.status === "done"
                            ? "text-ink-faint line-through"
                            : "text-ink"
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p
                          className={`mt-1 text-sm leading-6 ${
                            task.status === "done"
                              ? "text-ink-faint"
                              : "text-ink-dim"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="stamp" style={{ color: meta?.color }}>
                        <span className="stamp-dot" />
                        {meta?.label}
                      </span>

                      <select
                        value={task.status}
                        disabled={updatingId === task.id}
                        onChange={(e) =>
                          handleStatusChange(
                            task.id,
                            e.target.value as TaskStatus,
                          )
                        }
                        className="rounded-sm border border-line bg-panel px-3 py-1.5 font-mono text-xs text-ink outline-none transition hover:border-ink-faint focus:border-[var(--status-active)] disabled:opacity-50"
                      >
                        <option value="todo">Open</option>
                        <option value="in_progress">Active</option>
                        <option value="done">Done</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
