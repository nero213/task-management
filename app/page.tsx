"use client";

import { useEffect, useState } from "react";
import { getTasks } from "@/services/tasks";
import { Task } from "@/types/database";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  return (
    <div className="mx-auto my-10 max-w-[600px] p-5 font-sans">
      <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
        Task Manager
      </h1>
      <p className="mb-6 text-slate-500">
        Step 1: Testing Read Operation (`getTasks`)
      </p>

      {errorMsg && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-2.5 text-red-800">
          {errorMsg}
        </div>
      )}

      <ul className="m-0 space-y-2 p-0 list-none">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between rounded-md border border-slate-200 p-3"
          >
            <div>
              <strong className="font-semibold text-slate-900">
                {task.title}
              </strong>
              {task.description && (
                <p className="mt-1 text-sm text-slate-500">
                  {task.description}
                </p>
              )}
            </div>
            <span className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700">
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
