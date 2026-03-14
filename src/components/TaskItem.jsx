const TaskItem = ({ task, onToggleComplete, onDelete }) => {
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>
      <div className="task-actions">
        <button 
          className="btn-icon success" 
          onClick={() => onToggleComplete(task)}
          title={task.completed ? "Mark as pending" : "Mark as completed"}
        >
          {task.completed ? "↩️" : "✓"}
        </button>
        <button 
          className="btn-icon danger" 
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
