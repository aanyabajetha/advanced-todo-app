import { ADD_TASK, DELETE_TASK, SET_TASKS, SET_WEATHER, API_ERROR } from '../actions/taskActions';

const initialState = {
  tasks: [],
  weather: null,
  error: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TASKS:
      return { ...state, tasks: action.payload };
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case DELETE_TASK:
      return { ...state, tasks: state.tasks.filter(task => task.id !== action.payload) };
    case SET_WEATHER:
      return { ...state, weather: action.payload };
    case API_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default taskReducer;

