import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/api';
import TaskItem from './TaskItem';

function TaskList({ refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState({});
  const [statusErrors, setStatusErrors] = useState({});

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    getTasks()
      .then((response) => {
        if (isMounted) setTasks(response.data);
      })
      .catch(() => {
        if (isMounted) setError('Failed to load tasks. Please try again later.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleStatusChange = async (taskId, newStatus) => {
    const previousTask = tasks.find((task) => task.id === taskId);
    if (!previousTask || previousTask.status === newStatus) return;

    // Optimistic update so the dropdown reflects the choice immediately.
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
    setUpdatingIds((prev) => ({ ...prev, [taskId]: true }));
    setStatusErrors((prev) => ({ ...prev, [taskId]: null }));

    try {
      const response = await updateTaskStatus(taskId, newStatus);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response.data : task))
      );
    } catch (err) {
      // Roll back to the pre-change task on failure.
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? previousTask : task))
      );
      const data = err.response?.data;
      const message = data?.status?.[0] || data?.detail || 'Failed to update status. Please try again.';
      setStatusErrors((prev) => ({ ...prev, [taskId]: message }));
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  if (loading) {
    return <p className="text-gray-600">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (tasks.length === 0) {
    return <p className="text-gray-600">No tasks yet.</p>;
  }

  return (
    <ul className="list-none p-0 m-0 flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={handleStatusChange}
          updating={!!updatingIds[task.id]}
          error={statusErrors[task.id]}
        />
      ))}
    </ul>
  );
}

export default TaskList;
