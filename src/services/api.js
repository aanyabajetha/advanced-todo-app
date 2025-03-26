import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    // Add detailed logging
    console.log('Environment variable check:', {
      hasApiKey: !!API_KEY,
      apiKeyLength: API_KEY ? API_KEY.length : 0
    });

    if (!API_KEY) {
      throw new Error('Weather API key is not configured');
    }

    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    console.log('Requesting URL (without API key):', url.replace(API_KEY, 'HIDDEN'));
    
    const response = await axios.get(url);
    
    if (!response.data) {
      throw new Error('No data received from weather API');
    }
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // API responded with an error
      console.error('Weather API Error:', {
        status: error.response.status,
        data: error.response.data
      });
      throw new Error(`Weather API error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('No response received from weather service');
    } else {
      // Error in request setup
      console.error('Request setup error:', error.message);
      throw error;
    }
  }
};

export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};


