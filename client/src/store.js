import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';

import rootReducer from './reducers';

const middleware = [thunk];

const store = createStore(
  rootReducer,
  {},
  compose(
    applyMiddleware(...middleware),

    // IMPORTANT: remove following line before release this app 
    // the main purpose of this line is to make redux store available to see on the dev tools
    // window.__REDUX_DEVTOOLS_EXTENSION__ &&
    //   window.__REDUX_DEVTOOLS_EXTENSION__()

  )
);

export default store;
