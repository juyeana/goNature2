const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateTourInput(data) {
  let errors = {};

  if (!Validator.isLength(data.name, { min: 2, max: 40 })) {
    errors.name = 'Name must be between 2 and 40 characters';
  }
  if (isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (isEmpty(data.duration)) {
    errors.duration = 'Duration field is required';
  }
  if (isEmpty(data.maxGroupSize)) {
    errors.maxGroupSize = 'Max group size field is required';
  }

  if (isEmpty(data.difficulty)) {
    errors.difficulty = 'Difficulty field is required';
  }

  if (isEmpty(data.price)) {
    errors.price = 'Price field is required';
  }
  if (isEmpty(data.imageCover)) {
    errors.imageCover = 'Cover image field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
