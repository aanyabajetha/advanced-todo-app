import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUser } from '@clerk/clerk-react';
import { deleteTask, fetchWeatherData } from '../redux/actions/taskActions';
import './TaskList.css';

const TaskList = () => {
  const tasks = useSelector(state => state.task.tasks);
  const weather = useSelector(state => state.task.weather);
  const dispatch = useDispatch();
  const { user } = useUser();

  useEffect(() => {
    dispatch(fetchWeatherData('London')); // Replace with user's city
  }, [dispatch]);

  const handleDeleteTask = (taskId) => {
    if (user) {
      dispatch(deleteTask(taskId));
      
      // Update localStorage
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
      const updatedTasks = savedTasks.filter(task => task.id !== taskId);
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#2ecc71',
      medium: '#f1c40f',
      high: '#e74c3c'
    };
    return colors[priority.toLowerCase()] || colors.low;
  };

  // Filter tasks for current user
  const userTasks = user ? tasks.filter(task => task.userId === user.id) : [];

  return (
    <div className="task-list-container">
      {weather && (
        <div className="weather-widget">
          <i className="fas fa-cloud"></i>
          <span>{weather.main.temp}°C, {weather.weather[0].description}</span>
        </div>
      )}
      
      {userTasks.length > 0 ? (
        <div className="task-list">
          {userTasks.map((task) => (
            <div 
              key={task.id} 
              className="task-item"
              style={{ borderLeftColor: getPriorityColor(task.priority) }}
            >
              <div className="task-content">
                <h3>{task.name}</h3>
                <span className="task-priority">
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                </span>
                <span className="task-date">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              <button 
                onClick={() => handleDeleteTask(task.id)}
                className="delete-button"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <i className="fas fa-tasks"></i>
          <p>No tasks available. Add some tasks to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;



