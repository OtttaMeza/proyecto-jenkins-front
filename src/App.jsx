import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/taskService';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      const updatedTask = await updateTask(task.id, { ...task, completed: !task.completed });
      setTasks(tasks.map(t => (t.id === task.id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="app-container">
      <header>
        <h1>Task Manager</h1>
        <p className="subtitle">Track your project tasks efficiently</p>
      </header>
      
      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem' }}>Overview</h2>
        <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
          <p>Total Tasks: <strong>{tasks.length}</strong></p>
          <p>Completed: <strong>{completedCount}</strong></p>
          <p>Pending: <strong>{tasks.length - completedCount}</strong></p>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem' }}>Add New Task</h2>
        <TaskForm onSubmit={handleCreate} />
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '1rem' }}>Your Tasks</h2>
        {loading ? (
          <p className="empty-state">Loading tasks...</p>
        ) : (
          <TaskList 
            tasks={tasks} 
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDelete} 
          />
        )}
      </div>
    </div>
  );
}

export default App;
