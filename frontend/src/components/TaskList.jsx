import { ListTodo } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import TaskItem from './TaskItem';
import TaskFilter from './TaskFilter';
import Spinner from './Spinner';

function TaskList({ refreshTrigger, statusFilter, onFilterChange }) {
  const { tasks, loading, error, updatingIds, statusErrors, updateStatus } = useTasks({
    statusFilter,
    refreshTrigger,
  });

  return (
    <section>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-5">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          Your Tasks
          <span className="bg-slate-100 text-slate-500 text-sm font-semibold py-1 px-3 rounded-full">
            {tasks.length}
          </span>
        </h2>
        <TaskFilter value={statusFilter} onChange={onFilterChange} />
      </div>

      {loading && (
        <p className="flex items-center gap-2 text-slate-500">
          <Spinner className="h-4 w-4" /> Loading tasks...
        </p>
      )}

      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && tasks.length === 0 && (
        <div className="text-center py-16 bg-white rounded-4xl border border-slate-200/60 border-dashed">
          <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ListTodo className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No tasks found</h3>
          <p className="text-sm text-slate-500 mt-2">
            {statusFilter ? 'No tasks match this filter.' : 'Get started by creating a new task above.'}
          </p>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <ul className="list-none p-0 m-0 space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={updateStatus}
              updating={!!updatingIds[task.id]}
              error={statusErrors[task.id]}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskList;
