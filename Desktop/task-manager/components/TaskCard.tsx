interface TaskCardProps {
  title: string;
  description: string;
  completed: boolean;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
  isToggling: boolean;
}

export default function TaskCard({
  title,
  description,
  completed,
  onDelete,
  onToggle,
  onEdit,
  isToggling,
}: TaskCardProps) {
  return (
    <article
      className={`glass group relative overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl sm:p-6 ${
        completed
          ? "hover:border-emerald-400/40 hover:shadow-emerald-500/10"
          : "hover:border-indigo-400/50 hover:shadow-indigo-500/10"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          completed ? "bg-emerald-400" : "bg-indigo-500"
        }`}
      />

      <div className="flex flex-col gap-5 pl-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h3
              className={`wrap-break-word text-base font-bold tracking-tight transition sm:text-lg ${
                completed
                  ? "text-[var(--muted)] line-through decoration-emerald-400"
                  : "text-[var(--foreground)]"
              }`}
            >
              {title}
            </h3>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                completed
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100"
                  : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  completed ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {completed ? "Completed" : "In progress"}
            </span>
          </div>

          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-[var(--muted)]">
            {description || "No description provided."}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}

            className="glass-interactive rounded-lg border border-indigo-500/25 bg-indigo-500/10 px-3.5 py-2 text-sm font-semibold text-indigo-700 transition duration-200 hover:border-indigo-500/40 hover:bg-indigo-500/15 active:scale-95 dark:text-indigo-300"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onToggle}
            disabled={isToggling}

            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold backdrop-blur-xl ${
              completed
                ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            }`}
          >
            {isToggling ? "Updating..." : completed ? "Undo" : "Complete"}
          </button>

          <button
            type="button"
            onClick={onDelete}

            className="glass-interactive rounded-lg border border-red-500/25 bg-red-500/5 px-3.5 py-2 text-sm font-semibold text-red-600 transition duration-200 hover:border-red-500/40 hover:bg-red-500/10 active:scale-95 dark:text-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
