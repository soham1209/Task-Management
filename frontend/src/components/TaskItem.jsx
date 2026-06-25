const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
};

function TaskItem({ task, onStatusChange, updating, error }) {
  return (
    <li className="border border-gray-300 rounded-lg p-4 text-left">
      <h3 className="mb-1 font-semibold">{task.title}</h3>
      {task.description && (
        <p className="mb-2 text-gray-600">{task.description}</p>
      )}

      <div className="flex items-center gap-2">
        <select
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
          disabled={updating}
          className={`inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 ${STATUS_STYLES[task.status]}`}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {updating && <span className="text-xs text-gray-600">Updating...</span>}
      </div>

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </li>
  );
}

export default TaskItem;
