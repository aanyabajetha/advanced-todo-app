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

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'Geolocation API is not supported by this browser';
        console.error('[Geolocation Error]:', error);
        reject(new Error(error));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('[Geolocation Success]:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date(position.timestamp).toISOString()
          });
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          const errorDetails = {
            code: error.code,
            message: error.message,
            timestamp: new Date().toISOString()
          };
          console.error('[Geolocation Error]:', errorDetails);
          reject(error);
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  };

  const handleOutsideTaskToggle = async (checked) => {
    console.log('[Outside Task Toggle]:', { checked });
    setIsOutsideTask(checked);
    if (checked) {
      try {
        console.log('[Location Request]:', 'Initiating geolocation request');
        const coords = await getUserLocation();
        const weather = await fetchWeatherByCoords(coords.lat, coords.lon);
        setWeatherData(weather);
      } catch (error) {
        console.error('[Weather Data Error]:', error);
        setLocationError(error.message);
      }
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
        isOutsideTask
      };

      if (isOutsideTask && weatherData) {
        newTask.weather = {
          temperature: Math.round(weatherData.main.temp),
          description: weatherData.weather[0].description,
          icon: weatherData.weather[0].icon,
          location: weatherData.name,
          timestamp: new Date().toISOString()
        };
      }

      console.log('[New Task Created]:', {
        taskId: newTask.id,
        hasWeather: !!newTask.weather,
        weatherData: newTask.weather
      });

      dispatch(addTask(newTask));
      
      try {
        const savedTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`) || '[]');
        localStorage.setItem(`tasks_${user.id}`, JSON.stringify([...savedTasks, newTask]));
        console.log('[localStorage Update]:', 'Task saved successfully');
      } catch (error) {
        console.error('[localStorage Error]:', {
          message: error.message,
          taskId: newTask.id
        });
      }
      
      setTask('');
      setIsOutsideTask(false);
      setPriority('low');
      setWeatherData(null);
      setLocationError('');
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
      <button type="submit" className="add-button">
        <i className="fas fa-plus"></i> Add Task
      </button>
    </form>
  );
};

export default TaskInput;
