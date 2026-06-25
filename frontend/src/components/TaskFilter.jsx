import { TASK_STATUS_OPTIONS } from '../constants/taskStatus';

const FILTER_OPTIONS = [{ value: '', label: 'All' }, ...TASK_STATUS_OPTIONS];

function TaskFilter({ value, onChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="status-filter" className="block text-sm font-medium mb-1">
        Filter by status
      </label>
      <select
        id="status-filter"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded border border-gray-300 px-3 py-2"
      >
        {FILTER_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TaskFilter;
