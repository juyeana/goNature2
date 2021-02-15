const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const path = require('path');
const passport = require('passport');


const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
// const helmet = require('helmet') => cause error during heroku deply;
const mongoSanitize = require('express-mongo-sanitize');
// const xss = require('xss-clean')=> cause error during heroku deply;;
const hpp = require('hpp');
const compression = require('compression');

const tours = require('./route/api/tours');
const users = require('./route/api/users');
const reviews = require('./route/api/reviews')

const bookings = require('./route/api/bookings')
// const AppError = require('./utils/appError');
// const globalErrorHandler = require('./utils/globalErrorHandler');


const app = express();



//***** MIDDLEWARES *****

// set security HTTP header
// app.use(helmet());

//morgan : logger displays on the cosole
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// app.use('/uploads', express.static('uploads'))
//express : parses the JSON body, buffer, string, and URL encoded data submitted using HTTP POST
//body-parser was used to parse the body but now it was added to express.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (malicious html or javascript attached)
// app.use(xss());

// prevent from parameter pollution
// no duplicate parameters are allowed. All duplicate parameters except for the last one will be ignored
//use 'whitelist' for duplicate parameters
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);
//limit 100 requests from the same IP in one hour.
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many requests from this IP. Please try again in an hour',
});

app.use('/api', limiter);

app.use(compression())
//custom middleware to get the time of request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//***** ROUTES *****/
app.use('/api/v1/tours', tours);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/bookings', bookings);

//unhandled route handlers

// app.all('*', (req, res, next) => {
//   //when next passes 'err' Express knows an error occurrs. Then it stops all following middlewares and pass the error to the global handling middleware
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });

//global error handling middleware
// app.use(globalErrorHandler);

//DB connection;


const db = process.env.MONGO_URI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// SERVER setting
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`app running on port: ${port}`);
});

//Passport configuration

app.use(passport.initialize());

require('./config/passport')(passport);
