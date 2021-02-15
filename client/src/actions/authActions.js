import axios from 'axios';
import { SET_ERROR, SET_USER } from './types';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

export const signupUser = (userData, history) => (dispatch) => {
  axios
    .post('/api/v1/users/signup', userData)
    .then((res) => {
      history.push('/login');

      dispatch({
        type: SET_ERROR,
        payload: {},
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERROR,
        payload: err.response.data,
      });
    });
};

export const loginUser = (userData) => (dispatch) => {
  axios
    .post('/api/v1/users/login', userData)
    .then((res) => {
      // save the token to the local storage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);

      // set token to auth header
      setAuthToken(token);
      // decode the token
      const decoded = jwt_decode(token);
      // console.log(decoded)
      dispatch({ type: SET_USER, payload: decoded });
      dispatch({
        type: SET_ERROR,
        payload: {},
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERROR,
        payload: err.response.data,
      });
    });
};

export const logoutUser = () => (dispatch) => {
  // remove token from the local storage
  localStorage.removeItem('jwtToken');
  //remove token from the axios header
  setAuthToken(false);
  //remove data from the redux store
  dispatch({
    type: SET_USER,
    payload: {},
  });
  dispatch({
    type: SET_ERROR,
    payload: {},
  });
};

export const updateUser = (user) => (dispatch) => {
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

export const changePassword = (user) => (dispatch) => {
  axios
    .patch('/api/v1/users/changePassword', user)
    .then((res) => {
      
      alert('New password has been changed successfully! Please re-login');

      // remove token from the local storage
      localStorage.removeItem('jwtToken');
      //remove token from the axios header
      setAuthToken(false);
      //remove data from the redux store
      dispatch({
        type: SET_USER,
        payload: {},
      });
      dispatch({
        type: SET_ERROR,
        payload: {},
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_ERROR,
        payload: err.response.data,
      });
    });
};
