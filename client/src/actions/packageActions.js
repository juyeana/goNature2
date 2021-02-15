import axios from 'axios';
import { SET_ERROR, GET_PACKAGES, GET_PACKAGE, PACKAGE_LOADING } from './types';
export const getPackages = () => (dispatch) => {
  axios
    .get('/api/v1/tours')
    .then((res) => {
      dispatch({
        type: GET_PACKAGES,
        payload: res.data,
      });
      
    })
    .catch((err) =>
      dispatch({
        type: SET_ERROR,
        payload: err.response.data,
      })
    );
};

export const getPackageDetail = (id) => (dispatch) => {
  axios
    .get(`/api/v1/tours/${id}`)
    .then((res) => {

      dispatch({
        type: GET_PACKAGE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: SET_ERROR,
        payload: err.response.data,
      })
    );
};

export const setPackageLoading =()=>{
  return{
    type: PACKAGE_LOADING
  }
}


