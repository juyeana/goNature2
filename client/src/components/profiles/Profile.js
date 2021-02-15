import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import DefaultImg from '../../img/default.jpg';
// import UploadImage from './UploadImage';
import { changePassword } from '../../actions/authActions';
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      firebaseImage: DefaultImg,
      password: '',
      newPassword: '',
      newPasswordConfirm: '',
      errors: {},
    };
  }
  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const user = {
      password: this.state.password,
      newPassword: this.state.newPassword,
      newPasswordConfirm: this.state.newPasswordConfirm,
    };

    this.props.changePassword(user);
  }
  // componentDidMount() {
  //   if (this.props.auth.isAuthenticated) this.props.history.push('/profile');
  // }

  // componentDidUpdate() {
  //   if (

  //     this.props.auth.isAuthenticated
  //   ){
  //     // alert('Your password has been changed successfully')
  //     this.props.history.push('/profile');
  //   }
  // }

  render() {
    const { errors } = this.props;

    return (
      <section className='section-profile'>
        <div className='row'>
          <div className='profile'>
            <div className='profile__box'>
              <div className='u-center-text'>
                <h2 className='heading-secondary--small u-margin-top-medium'>
                  Your Profile
                </h2>
              </div>
              {/* <div>
                <UploadImage />
              </div> */}
              <div className='u-center-text'>
                <h2 className='heading-secondary--small u-margin-top-big'>
                  Password Change
                </h2>
              </div>
              {errors.message && (
                <div className='invalid-feedback--big'>{errors.message}</div>
              )}

              <form
                onSubmit={this.onSubmit.bind(this)}
                className='form--profile '
              >
                <div className='form__group heading-tertiary'>
                  <input
                    type='password'
                    required
                    className={classnames('form__input', {
                      'is-valid': errors.password,
                    })}
                    className='form__input'
                    placeholder='Current Password'
                    name='password'
                    value={this.state.password}
                    onChange={this.onChange.bind(this)}
                    id='password'
                  />
                </div>
                {errors.email && (
                  <div className='invalid-feedback'>{errors.password}</div>
                )}
                <div className='form__group heading-tertiary'>
                  <input
                    type='password'
                    required
                    className={classnames('form__input', {
                      'is-valid': errors.newPassword,
                    })}
                    className='form__input'
                    placeholder='New Password'
                    name='newPassword'
                    value={this.state.newPassword}
                    onChange={this.onChange.bind(this)}
                    id='newPassword'
                  />
                </div>
                {errors.newPassword && (
                  <div className='invalid-feedback'>{errors.newPassword}</div>
                )}
                <div className='form__group heading-tertiary'>
                  <input
                    type='password'
                    required
                    className={classnames('form__input', {
                      'is-valid': errors.newPasswordConfirm,
                    })}
                    className='form__input'
                    placeholder='Re-type New Password'
                    name='newPasswordConfirm'
                    value={this.state.newPasswordConfirm}
                    onChange={this.onChange.bind(this)}
                    id='newPasswordConfirm'
                  />
                </div>
                {errors.newPasswordConfirm && (
                  <div className='invalid-feedback'>
                    {errors.newPasswordConfirm}
                  </div>
                )}
                <div className='btn--signup u-right-text u-margin-top-small'>
                  <input
                    type='submit'
                    value='Change Password'
                    className='submit'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Profile.propTypes = {
  changePassword: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};
const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
});
export default connect(mapStateToProps, { changePassword })(Profile);
