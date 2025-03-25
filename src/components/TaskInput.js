import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useUser } from '@clerk/clerk-react';
import { addTask } from '../redux/actions/taskActions';
import { fetchWeatherByCoords } from '../services/api';
import './TaskInput.css';

const TaskInput = () => {
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('low');
  const [isOutsideTask, setIsOutsideTask] = useState(false);
  const [locationError, setLocationError] = useState('');
  const dispatch = useDispatch();
  const { user } = useUser();

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000 } // 10 second timeout
      );
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setLocationError('');

    if (task.trim() && user) {
      const newTask = {
        id: Date.now(),
        name: task,
        priority,
        createdAt: new Date().toISOString(),
        userId: user.id,
        isOutsideTask
      };

      if (isOutsideTask) {
        try {
          const coords = await getUserLocation();
          const weatherData = await fetchWeatherByCoords(coords.lat, coords.lon);
          
          newTask.weather = {
            temperature: Math.round(weatherData.main.temp),
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            location: weatherData.name, // Add city name
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          console.error('Failed to fetch weather data:', error);
          setLocationError(
            error.code === 1 
              ? 'Please enable location access to get weather data'
              : 'Failed to get weather data for your location'
          );
          newTask.weather = {
            temperature: null,
            description: 'Weather data unavailable',
            timestamp: new Date().toISOString()
          };
        }
      }

      dispatch(addTask(newTask));
      
      // Save to localStorage
      const savedTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify([...savedTasks, newTask]));
      
      // Reset form
      setTask('');
      setIsOutsideTask(false);
      setPriority('low');
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
          required
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
      <div className="outside-task-toggle">
        <label>
          <input
            type="checkbox"
            checked={isOutsideTask}
            onChange={(e) => setIsOutsideTask(e.target.checked)}
          />
          <span>This is an outside task</span>
        </label>
      </div>
      {locationError && (
        <div className="error-message">
          {locationError}
        </div>
      )}
      <button type="submit" className="add-button">
        Add Task
      </button>
    </form>
  );
};

export default TaskInput;


