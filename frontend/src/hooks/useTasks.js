import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus, deleteTask } from '../api/tasks';
import { getErrorMessage } from '../api/errors';

export function useTasks({ statusFilter, refreshTrigger } = {}) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState({});
  const [statusErrors, setStatusErrors] = useState({});
  const [deletingIds, setDeletingIds] = useState({});
  const [deleteErrors, setDeleteErrors] = useState({});

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    setError(null);

    getTasks(statusFilter)
      .then((response) => {
        if (isMounted) setTasks(response.data);
      })
      .catch((err) => {
        if (isMounted) {
          setError(getErrorMessage(err, 'Failed to load tasks. Please try again later.'));
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger, statusFilter]);

  const updateStatus = async (taskId, newStatus) => {
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
      setStatusErrors((prev) => ({
        ...prev,
        [taskId]: getErrorMessage(err, 'Failed to update status. Please try again.'),
      }));
    } finally {
      setUpdatingIds((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const removeTask = async (taskId) => {
    setDeletingIds((prev) => ({ ...prev, [taskId]: true }));
    setDeleteErrors((prev) => ({ ...prev, [taskId]: null }));

    try {
      await deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setDeleteErrors((prev) => ({
        ...prev,
        [taskId]: getErrorMessage(err, 'Failed to delete task. Please try again.'),
      }));
    } finally {
      setDeletingIds((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  return {
    tasks,
    loading,
    error,
    updatingIds,
    statusErrors,
    updateStatus,
    deletingIds,
    deleteErrors,
    removeTask,
  };
}
