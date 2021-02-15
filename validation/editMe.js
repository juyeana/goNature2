const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEditMeInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = 'Name must be between 2 and 40 characters';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
