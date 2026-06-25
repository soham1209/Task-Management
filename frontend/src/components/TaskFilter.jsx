const FILTER_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

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
