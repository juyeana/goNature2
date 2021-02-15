
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User=require('../models/User')
// const keys = require('./keys');


exports.protect = async (req, res, next) => {

  // console.log('req.headers: ',req.headers)
  // console.log(keys.secretOrKey)
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];}
  // } else if (req.cookies.jwt) {
  //   token = req.cookies.jwt;
  // }

  if (!token) {
 
     return res.status(401).json('You are not logged in! Please log in to get access') }

  
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.SECRET_OR_KEY);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  // console.log(currentUser);
  if (!currentUser) {
    return res.status(401).json('The user belonging to this token does not exist') }
    else{
      req.user = currentUser;

    }
  

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again.', 401)
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  // res.locals.user = currentUser;
  next();
}