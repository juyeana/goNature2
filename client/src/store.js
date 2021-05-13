import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';

import rootReducer from './reducers';

const middleware = [thunk];

// const saveToLocalStorage = state =>{
//   try{
//     // const serializedState = JSON.stringify(state)
// // console.log('serializedState -save: ', serializedState);

//     // localStorage.setItem('state', serializedState.auth);
// const imageState = state.auth.user.imageData
// console.log('imageState: ', imageState)
//     localStorage.setItem('imageState', imageState);

//   }catch(e){
//     console.log(e)
//   }
// }

// const loadFromLocalStorage =()=>{
//   try{
// //     const serializedState = localStorage.getItem('states')
// // console.log('serializedState-load: ', serializedState);
// const imageState = localStorage.getItem('imageState')

//     if(imageState === null) return undefined
//     return imageState
//   }catch(e){
//     console.log(e)
//     return undefined
//   }
// }

// const persistedState = loadFromLocalStorage()

// console.log('persistedState: ',persistedState)

const store = createStore(
  rootReducer,
  // {persistedState},

  compose(
    applyMiddleware(...middleware),

    // IMPORTANT: remove following line before release this app
    // the main purpose of this line is to make redux store available to see on the dev tools
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

// store.subscribe(()=>saveToLocalStorage(store.getState()))

export default store;
