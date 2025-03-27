import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { addTask, deleteTask, fetchWeatherData } from '../taskActions';
import { fetchWeatherByCity } from '../../../services/api';

jest.mock('../../../services/api');

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Task Actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  test('creates ADD_TASK when adding a task', () => {
    const task = { id: 1, name: 'Test Task' };
    const expectedActions = [
      { type: 'ADD_TASK', payload: task }
    ];

    store.dispatch(addTask(task));
    expect(store.getActions()).toEqual(expectedActions);
  });

  test('creates SET_WEATHER when fetching weather succeeds', async () => {
    const weatherData = {
      main: { temp: 20 },
      weather: [{ description: 'sunny' }]
    };
    
    fetchWeatherByCity.mockResolvedValue(weatherData);

    const expectedActions = [
      { type: 'SET_WEATHER', payload: weatherData }
    ];

    await store.dispatch(fetchWeatherData('London'));
    expect(store.getActions()).toEqual(expectedActions);
  });
});