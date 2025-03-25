import { LOGIN_USER, LOGOUT_USER, AUTH_ERROR } from '../actions/authActions';

const initialState = {
  loggedIn: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loggedIn: true
      };
    case LOGOUT_USER:
      return {
        ...state,
        loggedIn: false
      };
    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload
      };
    default:
      return state;
  }
};

export default authReducer;