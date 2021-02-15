import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      errors: {},
    };
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(user);
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) this.props.history.push('/profile');
  }

  componentDidUpdate() {
    if (
      // prevProps.auth.isAuthenticated !== this.props.auth.isAuthenticated &&
      this.props.auth.isAuthenticated
    )
      this.props.history.push('/profile');
  }

  render() {
    const { errors } = this.props;
    return (
      <section className='section-login'>
        <div className='row'>
          <div className='login'>
            <div className='login__box'>
              <div className='u-center-text'>
                <h2 className='heading-secondary u-margin-top-medium'>Login</h2>
              </div>
              <form
                noValidate
                onSubmit={this.onSubmit.bind(this)}
                className='form'
              >
                <div className='form__group heading-tertiary'>
                  <input
                    type='email'
                    className={classnames('form__input', {
                      'is-valid': errors.email,
                    })}
                    placeholder='Email'
                    name='email'
                    value={this.state.email}
                    onChange={this.onChange.bind(this)}
                    id='email'
                  />
                </div>
                {errors.email && (
                  <div className='invalid-feedback'>{errors.email}</div>
                )}
                <div className='form__group heading-tertiary'>
                  <input
                    type='password'
                    className={classnames('form__input', {
                      'is-valid': errors.password,
                    })}
                    placeholder='Password'
                    name='password'
                    value={this.state.password}
                    onChange={this.onChange.bind(this)}
                    id='password'
                  />
                </div>
                {errors.password && (
                  <div className='invalid-feedback'>{errors.password}</div>
                )}
                <div className='btn--signup u-right-text u-margin-top-small'>
                  <input type='submit' value='Login' className='submit' />
                  {/* &nbsp;&nbsp;
                  <input
                    type='submit'
                    value='Forgot Password'
                    className='submit'
                  /> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
});
export default connect(mapStateToProps, { loginUser })(Login);
