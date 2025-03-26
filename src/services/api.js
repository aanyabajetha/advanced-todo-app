import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeatherByCoords = async (lat, lon) => {
  console.log('[Weather API Request]:', {
    latitude: lat,
    longitude: lon,
    timestamp: new Date().toISOString()
  });

  try {
    if (!API_KEY) {
      throw new Error('Weather API key is not configured');
    }

    const url = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    console.log('Requesting URL (without API key):', url.replace(API_KEY, 'HIDDEN'));
    
    const response = await axios.get(url);
    
    if (!response.data) {
      throw new Error('No data received from weather API');
    }

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

    if (error.response) {
      throw new Error(`Weather API error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      throw new Error('No response received from weather service');
    } else {
      throw error;
    }
  }
};

export const fetchWeatherByCity = async (city) => {
  console.log('[Weather API Request]:', {
    city,
    timestamp: new Date().toISOString()
  });

  try {
    if (!API_KEY) {
      throw new Error('Weather API key is not configured');
    }

    const url = `${BASE_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
    console.log('Requesting URL (without API key):', url.replace(API_KEY, 'HIDDEN'));
    
    const response = await axios.get(url);
    
    if (!response.data) {
      throw new Error('No data received from weather API');
    }

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

    if (error.response) {
      throw new Error(`Weather API error: ${error.response.data.message || error.message}`);
    } else if (error.request) {
      throw new Error('No response received from weather service');
    } else {
      throw error;
    }
  }
};


