import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import jwt_decode from 'jwt-decode';
import Landing from './components/layouts/Landing';

import Footer from './components/layouts/Footer';
import Navbar from './components/layouts/Navbar';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Packages from './components/packages/Packages';
import PackageDetail from './components/packages/PackageDetail';
import Profile from './components/profiles/Profile';
// import BookPackage from './components/bookings/BookPackage';
// import BookingSuccess from './components/bookings/BookingSuccess';

import store from './store';
import { logoutUser } from './actions/authActions';
import setAuthToken from './utils/setAuthToken';
import { SET_USER } from './actions/types';
import PrivateRoute from './components/common/PrivateRoute';

//token expiry

if (localStorage.jwtToken) {
  // decode and get the expiry
  const decoded = jwt_decode(localStorage.jwtToken);

  // compare it with current time
  if (decoded.exp < Date.now() / 1000) {
    store.dispatch(logoutUser());
    // redirect user to login
    window.location.redirect('/login');
  }

  // set axios header  with the token
  setAuthToken(localStorage.jwtToken);
  // reload user info in to the redux store
  store.dispatch({
    type: SET_USER,
    payload: decoded,
  });
}
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/packages' component={Packages} />
            <Route exact path='/package-detail/:id' component={PackageDetail} />
            <Route exact path='/signup' component={Signup} />

            {/* <Switch>
              <PrivateRoute exact path='/booking/:id' component={BookPackage} />
            </Switch> */}
            {/* <Switch>
              <PrivateRoute
                exact
                path='/booking-processed'
                component={BookingSuccess}
              />
            </Switch> */}
            <Switch>
              <PrivateRoute exact path='/logout' component={Login} />
            </Switch>
            <Switch>
              <PrivateRoute exact path='/profile' component={Profile} />
            </Switch>

            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
