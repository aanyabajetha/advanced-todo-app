import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TaskInput from '../TaskInput';

const mockStore = configureStore([]);

describe('TaskInput Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      task: {
        tasks: []
      }
    });
  });

  test('renders task input form', () => {
    render(
      <Provider store={store}>
        <TaskInput />
      </Provider>
    );
    
    expect(screen.getByPlaceholderText('Add a new task...')).toBeInTheDocument();
    expect(screen.getByText('Low Priority')).toBeInTheDocument();
    expect(screen.getByText('This is an outside task')).toBeInTheDocument();
  });

  test('handles task submission', () => {
    render(
      <Provider store={store}>
        <TaskInput />
      </Provider>
    );
    
    const input = screen.getByPlaceholderText('Add a new task...');
    const submitButton = screen.getByText('Add Task');

    fireEvent.change(input, { target: { value: 'New Test Task' } });
    fireEvent.click(submitButton);

    const actions = store.getActions();
    expect(actions).toContainEqual(expect.objectContaining({
      type: 'ADD_TASK',
      payload: expect.objectContaining({
        name: 'New Test Task'
      })
    }));
  });
});