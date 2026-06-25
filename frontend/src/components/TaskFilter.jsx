import { TASK_STATUS_OPTIONS } from '../constants/taskStatus';

const FILTER_OPTIONS = [{ value: '', label: 'All' }, ...TASK_STATUS_OPTIONS];

function TaskFilter({ value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Filter tasks by status"
      className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto border border-slate-200/60"
    >
      {FILTER_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            value === option.value
              ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/50'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TaskFilter;
