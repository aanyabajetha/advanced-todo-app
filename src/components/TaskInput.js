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
  const [weatherData, setWeatherData] = useState(null);
  const dispatch = useDispatch();
  const { user } = useUser();

  const getLocation = () => {
    if (!navigator.geolocation) {
      const error = 'Geolocation API is not supported by this browser';
      console.error('[Geolocation Error]:', error);
      setLocationError(error);
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
      
      try {
        // Save to localStorage
        const savedTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
        localStorage.setItem(`tasks_${user.id}`, JSON.stringify([...savedTasks, newTask]));
        console.log('[localStorage Update]:', 'Task saved successfully');
      } catch (error) {
        console.error('[localStorage Error]:', {
          message: error.message,
          taskId: newTask.id
        });
      }
      
      // Reset form
      setTask('');
      setIsOutsideTask(false);
      setPriority('low');
      setWeatherData(null);
      console.log('[Form Reset]:', 'Form state cleared');
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
            onChange={(e) => handleOutsideTaskToggle(e.target.checked)}
          />
          <span>This is an outside task</span>
        </label>
      </div>
      {locationError && (
        <div className="error-message">
          {locationError}
        </div>
      )}
      {isOutsideTask && weatherData && (
        <div className="weather-preview">
          <i className="fas fa-cloud-sun"></i>
          <span>
            Current weather: {weatherData.temperature}°C, {weatherData.description} in {weatherData.location}
          </span>
        </div>
      )}
      <button type="submit" className="add-button">
        Add Task
      </button>
    </form>
  );
};

export default TaskInput;




