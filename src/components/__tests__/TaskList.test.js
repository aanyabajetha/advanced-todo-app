import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import TaskList from '../TaskList';

const mockStore = configureStore([]);

describe('TaskList Component', () => {
  let store;
  const initialTasks = [
    { id: 1, name: 'Test Task 1', priority: 'high' },
    { id: 2, name: 'Test Task 2', priority: 'low' }
  ];

  beforeEach(() => {
    store = mockStore({
      task: {
        tasks: initialTasks
      }
    });
  });

  test('renders task list', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  test('handles task deletion', () => {
    render(
      <Provider store={store}>
        <TaskList />
      </Provider>
    );
    
    const deleteButtons = screen.getAllByRole('button');
    fireEvent.click(deleteButtons[0]);

    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'DELETE_TASK',
      payload: 1
    });
  });
});