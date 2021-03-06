import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logoutUser } from '../../actions/authActions';
import DefaultImg from '../../img/default.jpg';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firebaseImage: DefaultImg,
    };
  }

  onLogoutClick(e) {
    e.preventDefault();

    this.props.logoutUser();
  }
  componentDidMount() {
    if (this.props.auth.user.imageData) {
      this.setState({ firebaseImage: this.props.auth.user.imageData });
    }
  }

  componentDidUpdate(prevProps) {
    // console.log(prevProps);
    if (prevProps.auth.user.imageData !== this.props.auth.user.imageData) {
      this.setState({ firebaseImage: this.props.auth.user.imageData });
    }
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const guest = (
      <Fragment>
        {' '}
        <li className='nav__item nav__right'>
          <Link to='/login' className='nav__link'>
            Login
          </Link>
        </li>
        <li className='nav__item'>
          <Link to='/signup' className='nav__link'>
            signup
          </Link>
        </li>
      </Fragment>
    );
    const authUser = (
      <Fragment>
        {' '}
        <li className='nav__item nav__right '>
          <Link to='/profile' className='nav__link'>
            <img
              className='rounded-circle u-margin-top-small'
              src={this.state.firebaseImage}
              alt={user.name}
              // style={{ width: '25px', marginRight: '5px' }}
            />
          </Link>
          <span className='default-font nav-invisible'>
            {user.name ? user.name.split(' ')[0] : ''}
          </span>
        </li>
        <li className='nav__item'>
          <Link
            to='/login'
            onClick={this.onLogoutClick.bind(this)}
            className='nav__link'
          >
            Logout
          </Link>
        </li>
      </Fragment>
    );
    return (
      <nav className='nav'>
        <div className='row'>
          <div className='nav__navigation'>
            <ul className='nav__list u-margin-left-small'>
              <li className='nav__item'>
                <Link to='/' className='nav__logo'>
                  <i className='fab fa-pagelines'></i>
                  <span className='nav__logo__name'>goNature</span>{' '}
                </Link>
              </li>
              <li className='nav__item'>
                <Link to='/packages' className='nav__link'>
                  Retreat Packages
                </Link>
              </li>
              {isAuthenticated ? authUser : guest}
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,

});
export default connect(mapStateToProps, { logoutUser })(Navbar);
