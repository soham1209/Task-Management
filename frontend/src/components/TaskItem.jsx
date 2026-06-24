function TaskItem({ task }) {
  return (
    <li className="task-item">
      <h3 className="task-item-title">{task.title}</h3>
      {task.description && (
        <p className="task-item-description">{task.description}</p>
      )}
      <span className={`task-item-status status-${task.status}`}>
        {task.status.replace('_', ' ')}
      </span>
    </li>
  );
}

export default TaskItem;
