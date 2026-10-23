
"use client";

import { useState } from "react";

interface TaskFormProps {
  onAddTask: (title: string, description: string) => Promise<boolean>;
  isAdding: boolean;
}

export default function TaskForm({ onAddTask, isAdding }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || isAdding) return;

    const success = await onAddTask(title.trim(), description.trim());

    if (success) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
        >
          Task title <span className="text-indigo-600">*</span>
        </label>

        <input
          id="title"
          type="text"
          maxLength={255}
          required
          placeholder="e.g. Finish the Prisma integration"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="glass w-full rounded-xl px-4 py-3 text-sm text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--muted)] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-semibold text-[var(--foreground)]"
        >
          Description{" "}
          <span className="font-normal text-[var(--muted)]">(optional)</span>
        </label>

        <textarea
          id="description"
          placeholder="Add details, notes, or the next steps..."
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="glass w-full resize-y rounded-xl px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition-all duration-200 placeholder:text-[var(--muted)] focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-400">
          Keep it simple. One task at a time.
        </p>

        <button
          type="submit"
          disabled={isAdding || !title.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-md"
        >
         {isAdding ? (
  <>
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
    Adding task...
  </>
) : (
  <>
    <span className="text-lg leading-none">+</span>
    Add task
  </>
)}
        </button>
      </div>
    </form>
  );
}
