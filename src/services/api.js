import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherByCity = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const fetchWeatherByCoords = async (lat, lon) => {
  console.log('[Weather API Request]:', {
    latitude: lat,
    longitude: lon,
    timestamp: new Date().toISOString()
  });

  try {
    const response = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    console.log('[Weather API Success]:', {
      city: response.data.name,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description
    });
    return response.data;
  } catch (error) {
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      timestamp: new Date().toISOString()
    };
    console.error('[Weather API Error]:', errorDetails);
    throw error;
  }
};



