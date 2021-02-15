const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateReviewInput(data) {
  let errors = {};
  if (isEmpty(data.review)) {
    errors.review = 'review field is required';
  }

  if (
    !Validator.isInt(data.rating, {
      min: 1,
      max: 5,
      allow_leading_zeroes: false,
    })
  ) {
    errors.rating = 'Rating must be between 1 and 5';
  }
  if (isEmpty(data.rating)) {
    errors.rating = 'rating field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
