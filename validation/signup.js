const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateSignupInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = 'Name must be between 2 and 40 characters';
  }
  if (isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  if (isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }
  if (isEmpty(data.passwordConfirm)) {
    errors.passwordConfirm = 'Password confirmation field is required';
  }


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
    errors.passwordConfirm = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
