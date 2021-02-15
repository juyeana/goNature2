const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const keys = require('./keys');
const User = require('../models/User');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_OR_KEY;

// console.log('opts: ',opts)

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      // console.log(jwt_payload);

      User.findById(jwt_payload.id)
        .then((user) => {
          //check the time stamp of password creation to see if it was modified after a token issued
          const timeStampChange = parseInt(
            user.passwordChangedAt.getTime() / 1000
          );

          // console.log(timeStampChange);

          if (user && jwt_payload.iat >= timeStampChange) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
