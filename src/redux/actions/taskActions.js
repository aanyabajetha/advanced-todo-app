import { fetchWeather } from '../../services/api';

export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const SET_WEATHER = 'SET_WEATHER';
export const API_ERROR = 'API_ERROR';

export const addTask = (task) => ({
  type: ADD_TASK,
  payload: task,
});

export const deleteTask = (taskId) => ({
  type: DELETE_TASK,
  payload: taskId,
});

export const setWeather = (weatherData) => ({
  type: SET_WEATHER,
  payload: weatherData,
});

export const apiError = (error) => ({
  type: API_ERROR,
  payload: error,
});

export const fetchWeatherData = (city) => async (dispatch) => {
  try {
    const weatherData = await fetchWeather(city);
    dispatch(setWeather(weatherData));
  } catch (error) {
    dispatch(apiError(error.message));
  }
};
