import axios from 'axios';
import { fetchWeatherByCity, fetchWeatherByCoords } from '../api';

jest.mock('axios');

describe('API Services', () => {
  beforeEach(() => {
    process.env.REACT_APP_WEATHER_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('fetchWeatherByCity returns weather data', async () => {
    const mockWeatherData = {
      data: {
        main: { temp: 20 },
        weather: [{ description: 'sunny' }]
      }
    };
    
    axios.get.mockResolvedValue(mockWeatherData);

    const result = await fetchWeatherByCity('London');
    expect(result).toEqual(mockWeatherData.data);
  });

  test('fetchWeatherByCoords handles errors', async () => {
    const errorMessage = 'API Error';
    axios.get.mockRejectedValue(new Error(errorMessage));

    await expect(fetchWeatherByCoords(51.5074, -0.1278))
      .rejects
      .toThrow('No response received from weather service');
  });
});