import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUser } from '@clerk/clerk-react';
import { deleteTask } from '../redux/actions/taskActions';
import { setTasks } from '../redux/actions/taskActions';
import './TaskList.css';

const TaskList = () => {
  const tasks = useSelector(state => state.task.tasks);
  const dispatch = useDispatch();
  const { user } = useUser();

  // Load tasks from localStorage when component mounts
  useEffect(() => {
    if (user) {
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
      dispatch(setTasks(savedTasks));
    }
  }, [user, dispatch]);

  const handleDeleteTask = (taskId) => {
    if (user) {
      dispatch(deleteTask(taskId));
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
                <div className="task-details">
                  <span className="task-priority">
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </span>
                  <span className="task-date">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {task.isOutsideTask && task.weather && (
                  <div className="task-weather">
                    <i className="fas fa-cloud-sun"></i>
                    <span>
                      {task.weather.temperature !== null 
                        ? `${task.weather.temperature}°C, ${task.weather.description} in ${task.weather.location}`
                        : 'Weather data unavailable'}
                    </span>
                    <small>
                      Weather as of {new Date(task.weather.timestamp).toLocaleTimeString()}
                    </small>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleDeleteTask(task.id)}
                className="delete-button"
                aria-label="Delete task"
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


