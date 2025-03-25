import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useUser } from '@clerk/clerk-react';
import { addTask } from '../redux/actions/taskActions';
import './TaskInput.css';

const TaskInput = () => {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('low');
  const dispatch = useDispatch();
  const { user } = useUser();

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      const savedTasks = localStorage.getItem(`tasks_${user.id}`);
      if (savedTasks) {
        dispatch({ type: 'SET_TASKS', payload: JSON.parse(savedTasks) });
      }
    }
  }, [dispatch, user]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (task.trim() && user) {
      const newTask = {
        id: Date.now(),
        name: task,
        priority,
        createdAt: new Date().toISOString(),
        userId: user.id
      };
      
      dispatch(addTask(newTask));
      setTask('');
      
      // Save to localStorage
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify([...savedTasks, newTask]));
    }
  };

  return (
    <form className="task-input-form" onSubmit={handleAddTask}>
      <div className="input-group">
        <input 
          type="text" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          placeholder="Add a new task..."
          className="task-input"
        />
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          className="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>
      <button type="submit" className="add-button">
        Add Task
      </button>
    </form>
  );
};

export default TaskInput;



