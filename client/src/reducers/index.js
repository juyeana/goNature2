import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import packageReducer from './packageReducer';


export default combineReducers({
  auth: authReducer,
  errors:errorReducer,
  packages:packageReducer,

});

