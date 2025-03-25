// Action Types
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const AUTH_ERROR = 'AUTH_ERROR';

// Action Creators
export const loginUser = (userData) => ({
  type: LOGIN_USER,
  payload: userData
});

export const logoutUser = () => ({
  type: LOGOUT_USER
});

export const authError = (error) => ({
  type: AUTH_ERROR,
  payload: error
});