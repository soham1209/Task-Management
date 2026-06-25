import { TASK_STATUS_OPTIONS, TASK_STATUS_STYLES, TASK_STATUS_ACCENTS } from '../constants/taskStatus';
import Spinner from './Spinner';

function TaskItem({ task, onStatusChange, updating, error }) {
  return (
    <li className="group bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg border border-slate-200/60 transition-all duration-200 flex items-stretch gap-4 relative overflow-hidden hover:-translate-y-0.5">
      <div className={`w-1.5 rounded-full shrink-0 ${TASK_STATUS_ACCENTS[task.status]}`} />

      <div className="flex-1 py-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-bold truncate ${
                task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1.5 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {updating && <Spinner className="h-3.5 w-3.5 text-slate-400" />}
            <div className="relative">
              <select
                value={task.status}
                onChange={(event) => onStatusChange(task.id, event.target.value)}
                disabled={updating}
                className={`appearance-none rounded-xl pl-3.5 pr-8 py-1.5 text-xs font-bold uppercase tracking-wide cursor-pointer border focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all disabled:cursor-not-allowed disabled:opacity-70 ${TASK_STATUS_STYLES[task.status]}`}
              >
                {TASK_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 opacity-50">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </li>
  );
}

export default TaskItem;
