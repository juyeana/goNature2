const jwt = require('jsonwebtoken');
// const keys = require('./keys');

const createSendToken = (payload, req, res) => {

  // console.log('payload:',payload)
  const token = jwt.sign(payload, process.env.SECRET_OR_KEY, {
    expiresIn: process.env.TOKEN_EXPRIES_IN,
  });

  //set http only cookie
  // const cookieOptions = {
  //   expires: new Date(Date.now() + keys.cookieExpiresIn * 24 * 60 * 60 * 1000),
  //   httpOnly: true,
  //   secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
  // };
  // if(process.env.NODE_ENV == 'production') cookieOptions.secure = true;

  // res.cookie('jwt', 'Bearer ' + token, cookieOptions);

  // FOR Postman test
  // return res.status(200).json({ token: token });

  // FOR Production
  return res.status(200).json({ token: 'Bearer ' + token });

  // NOTE: use following for Postman API test
  // return res.status(200).json({
  //   status: 'success',
  //   token,
  // });
};

module.exports = createSendToken;
