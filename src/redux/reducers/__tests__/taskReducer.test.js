import taskReducer from '../taskReducer';
import { ADD_TASK, DELETE_TASK, SET_TASKS } from '../../actions/taskActions';

describe('Task Reducer', () => {
  const initialState = {
    tasks: [],
    weather: null,
    error: null,
  };

  test('returns initial state', () => {
    expect(taskReducer(undefined, {})).toEqual(initialState);
  });

  test('handles ADD_TASK', () => {
    const task = { id: 1, name: 'Test Task' };
    const action = { type: ADD_TASK, payload: task };
    
    const expectedState = {
      ...initialState,
      tasks: [task]
    };

    expect(taskReducer(initialState, action)).toEqual(expectedState);
  });

  test('handles DELETE_TASK', () => {
    const initialStateWithTask = {
      ...initialState,
      tasks: [{ id: 1, name: 'Test Task' }]
    };
    
    const action = { type: DELETE_TASK, payload: 1 };
    
    expect(taskReducer(initialStateWithTask, action)).toEqual(initialState);
  });
});