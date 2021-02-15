import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';


import classnames from 'classnames';
import { signupUser } from '../../actions/authActions';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
      errors: {},
    };
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  onSubmit(e) {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
    };

    this.props.signupUser(newUser, this.props.history);
  }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.errors) {
  //     this.setState({errors:nextProps.errors});
  //   }
  //   if(nextProps.auth.user){
  //     // console.log(this.props.history)
  //     // this.props.history.push('/login')
  //   }
  // }
  // static getDerivedStateFromProps(props, state) {
  //   if (props.errors !== state.errors) {
  //     return { errors: props.errors };
  //   }
  // }

  render() {
    const { errors } = this.props;

    return (
      <section className='section-signup'>
        <div className='row'>
          <div className='signup'>
            <div className='signup__box'>
              <div className='u-center-text'>
                <h2 className='heading-secondary u-margin-top-medium'>
                  Sign up
                </h2>
              </div>
              <form
                noValidate
                onSubmit={this.onSubmit.bind(this)}
                className='form'
              >
                <div className='form__group heading-tertiary'>
                  <input
                    type='text'
                    className={classnames('form__input', {
                      ' is-valid': errors.name,
                    })}
                    placeholder='Name'
                    name='name'
                    // binding to read value from the state
                    value={this.state.name}
                    // binding to write the value from the input text into the state
                    //  take 'this' control (text box) and pass that with the onChange function
                    onChange={this.onChange.bind(this)}
                    id='name'
                    // required
                  />
                </div>
                {/* shows invalid error below the input box */}
                {errors.name && (
                  <div className='invalid-feedback'>{errors.name}</div>
                )}

                <div className='form__group heading-tertiary'>
                  <input
                    type='email'
                    className={classnames('form__input', {
                      ' is-valid': errors.email,
                    })}
                    placeholder='Email'
                    name='email'
                    value={this.state.email}
                    onChange={this.onChange.bind(this)}
                    id='email'
                    // required
                  />
                </div>
                {errors.email && (
                  <div className='invalid-feedback'>{errors.email}</div>
                )}
                <div className='form__group heading-tertiary'>
                  <input
                    type='password'
                    className={classnames('form__input', {
                      ' is-valid': errors.password,
                    })}
                    placeholder='Password'
                    name='password'
                    value={this.state.password}
                    onChange={this.onChange.bind(this)}
                    id='password'
                    // required
                  />
                </div>
                {errors.password && (
                  <div className='invalid-feedback'>{errors.password}</div>
                )}

                <div className='form__group heading-tertiary'>
                  <input
                    type='password'
                    className={classnames('form__input', {
                      ' is-valid': errors.passwordConfirm,
                    })}
                    placeholder='Confirm Password'
                    name='passwordConfirm'
                    value={this.state.passwordConfirm}
                    onChange={this.onChange.bind(this)}
                    id='passwordConfirm'
                    // required
                  />
                </div>
                {errors.passwordConfirm && (
                  <div className='invalid-feedback'>
                    {errors.passwordConfirm}
                  </div>
                )}
                <div className='btn--signup u-right-text u-margin-top-small'>
                  <input type='submit' value='submit' className='submit' />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

// all dependent components need to be loaded in memory first to load Signup component
Signup.propTypes = {
  signupUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({ errors: state.errors });

export default connect(mapStateToProps, { signupUser })(Signup);
