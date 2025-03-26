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

    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          console.log('[Geolocation Success]:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString()
          });

          const { latitude, longitude } = position.coords;
          const weather = await fetchWeatherByCoords(latitude, longitude);
          
          console.log('[Weather API Response]:', weather);
          
          setWeatherData({
            temperature: Math.round(weather.main.temp),
            description: weather.weather[0].description,
            location: weather.name,
            icon: weather.weather[0].icon
          });
        } catch (error) {
          const errorMessage = {
            message: error.message,
            code: error.response?.status,
            data: error.response?.data
          };
          console.error('[Weather API Error]:', errorMessage);
          setLocationError('Failed to fetch weather data');
        }
      },
      (error) => {
        const errorDetails = {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString()
        };
        console.error('[Geolocation Error]:', errorDetails);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Please allow location access to get weather data');
            console.warn('[User Permission]:', 'Location access denied by user');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable');
            console.error('[Position Error]:', 'Location information unavailable');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out');
            console.error('[Timeout Error]:', 'Geolocation request timed out');
            break;
          default:
            setLocationError('An unknown error occurred');
            console.error('[Unknown Error]:', error);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const handleOutsideTaskToggle = (checked) => {
    console.log('[Outside Task Toggle]:', { checked });
    setIsOutsideTask(checked);
    if (checked) {
      console.log('[Location Request]:', 'Initiating geolocation request');
      getLocation();
    } else {
      console.log('[Weather Reset]:', 'Clearing weather data');
      setWeatherData(null);
      setLocationError('');
    }
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
        isOutsideTask,
        weather: isOutsideTask ? {
          ...weatherData,
          timestamp: new Date().toISOString()
        } : null
      };

      console.log('[New Task Created]:', {
        taskId: newTask.id,
        hasWeather: !!newTask.weather,
        weatherData: newTask.weather
      });

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




