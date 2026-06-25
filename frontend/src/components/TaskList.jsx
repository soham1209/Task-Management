import { useEffect, useState } from 'react';
import { getTasks } from '../api/api';
import TaskItem from './TaskItem';
import './TaskList.css';

function TaskList({ refreshTrigger }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p className="task-list-status">Loading tasks...</p>;
  }

  if (error) {
    return <p className="task-list-status task-list-error">{error}</p>;
  }

  if (tasks.length === 0) {
    return <p className="task-list-status">No tasks yet.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TaskList;
