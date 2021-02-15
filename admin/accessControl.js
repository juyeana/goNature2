const AppError = require('../utils/appError');

exports.restrictTo = (...roles) => {
  return (req, res, next) => {

    // console.log('restrict to: ', req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

