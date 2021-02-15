const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateResetPasswordInput(data) {
  let errors = {};

  if (!isEmpty(data.password) && isEmpty(data.passwordConfirm)) {
    if (!Validator.isLength(data.password, { min: 8, max: 40 })) {
      errors.password = 'Password must be between 8 and 40 characters';
    } else {
      errors.passwordConfirm = 'Password confirmation field is required';
    }
  }

  if (
    !isEmpty(data.password) &&
    !isEmpty(data.passwordConfirm) &&
    !Validator.equals(data.password, data.passwordConfirm)
  ) {
    errors.password = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
