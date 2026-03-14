import { useState } from 'react';

const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({ title, description, completed: false });
    setTitle('');
    setDescription('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="input-group">
        <label htmlFor="title">Title *</label>
        <input 
          id="title"
          type="text" 
          placeholder="What needs to be done?" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          autoComplete="off"
        />
      </div>
      <div className="input-group">
        <label htmlFor="description">Description (Optional)</label>
        <textarea 
          id="description"
          placeholder="Add some details..." 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
        />
      </div>
      <button 
        type="submit" 
        className="btn-primary" 
        disabled={!title.trim()}
      >
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
