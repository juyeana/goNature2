const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateChangePasswordInput(data) {
  let errors = {};

  if (!isEmpty(data.newPassword) && isEmpty(data.newPasswordConfirm)) {
    if (!Validator.isLength(data.newPassword, { min: 8, max: 40 })) {
      errors.newPassword = 'Password must be between 8 and 40 characters';
    } else {
      errors.newPasswordConfirm = 'Password confirmation field is required';
    }
  }

  if (
    !isEmpty(data.newPassword) &&
    !isEmpty(data.newPasswordConfirm) &&
    !Validator.equals(data.newPassword, data.newPasswordConfirm)
  ) {
    errors.newPasswordConfirm = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
