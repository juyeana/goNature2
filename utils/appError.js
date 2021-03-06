class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;

    //error: operational error
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error;';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;