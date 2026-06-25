import { useTasks } from '../hooks/useTasks';
import TaskItem from './TaskItem';

function TaskList({ refreshTrigger, statusFilter }) {
  const { tasks, loading, error, updatingIds, statusErrors, updateStatus } = useTasks({
    statusFilter,
    refreshTrigger,
  });

  if (loading) {
    return <p className="text-gray-600">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (tasks.length === 0) {
    return (
      <p className="text-gray-600">
        {statusFilter ? 'No tasks match this filter.' : 'No tasks yet.'}
      </p>
    );
  }

  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-3">
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
  );
}

export default TaskList;
