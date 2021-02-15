const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
crypto = require('crypto');
const passport = require('passport');
const User = require('../../models/User');
const AppError = require('../../utils/appError');
const validateSignInput = require('../../validation/signup');
const validateLoginInput = require('../../validation/login');
const validateResetPasswordInput = require('../../validation/resetPassword');
const validateChangePasswordInput = require('../../validation/changePassword');
const validateEditMeInput = require('../../validation/editMe');
const accessControl = require('../../admin/accessControl');

// const keys = require('../../config/keys');
const createSendToken = require('../../config/auth');

const sendEmail = require('../../utils/email');


// const passport2 = require('../../config/passport2');





const router = express.Router();

// @route   GET /api/v1/users
// @desc    get all active users
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('admin'),
  async (req, res, next) => {
    try {
      const user = await User.find({ active: true });
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   GET /api/v1/users
// @desc    get all inactive users
// @access  Private
router.get(
  '/inactiveUsers',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('admin'),
  async (req, res, next) => {
    try {
      const user = await User.find({ active: false });
      res.status(200).json({
        status: 'success',
        data: {
          user,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   GET /api/v1/users/deleteUser
// @desc    delete current user from the database permanently
// @access  Private

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('admin'),
  async (req, res, next) => {
    try {
      await User.findByIdAndDelete(req.params.id);

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST /api/v1/users/signup
// @desc    create new user
// @access  Public

router.post('/signup', async (req, res, next) => {
  try {
    const { errors, isValid } = validateSignInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ email: 'Email already exists' });
    } else {
      //password encrypted before it's saved into the database
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        passwordChangedAt: new Date(),
        role: req.body.role,
      });

      newUser.password = undefined;
      newUser.passwordChangedAt = undefined;
      res.status(201).json({ user: newUser });
      // res.status(201).json({
      //   status: 'success',
      //   data: {
      //     user: newUser,
      //   },
      // });
    }
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/v1/users/login
// @desc    login
// @access  Private

router.post('/login', async (req, res, next) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(403).json(errors);
    }
    const { email, password } = req.body;

    //find user by email to check its existence
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({
        email: 'User not found',
      });
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    //if password matched... Create and send a new token
    if (isMatch) {
      const payload = {
        id: user.id,
        name: user.name,
        imageData: user.imageData,
        imageName: user.imageName,
      };
      createSendToken(payload, req, res);
    } else {
      return res.status(404).json({ password: 'Password incorrect' });
    }
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/v1/users/forgotPassword
// @desc    forgot password
// @access  Private
router.post('/forgotPassword', async (req, res, next) => {
  //get user info
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ errors: 'Your email does not exsit' });
  }

  //generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //send it to user's email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit your new password to :${resetURL} \n If you didn't forget your password, please ignore this message`;

    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'We sent you a change password link to your email. ',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    next(
      new AppError('There was an error occurred. Please try again later', 500)
    );
  }
});

// @route   GET /api/v1/users/resetPassword/:token
// @desc    reset password
// @access  Private
router.patch('/resetPassword/:token', async (req, res, next) => {
  try {
    //  hashed req.params.token to compare with the passwordResetToken

    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    //Get user based on the token and check if the token is valid
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // if the user exists, reset the new password
    if (!user) {
      return next(new AppError('Token is invalid or expired', 400));
    }
    const { errors, isValid } = validateResetPasswordInput(req.body);

    if (!isValid) {
      return res.status(404).json(errors);
    }

    user.password = req.body.password;
    user.passwordChangedAt = Date.now();
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // update changedPasswordAt in the database
    // to save new password, .save() needs to be used. Update() won't work with 'pre' middlewares
    await user.save();

    res.status(200).json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/v1/users/changePassword
// @desc    change password
// @access  Private

router.patch(
  '/changePassword',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { errors, isValid } = validateChangePasswordInput(req.body);

      if (!isValid) {
        return res.status(400).json( errors );
      }

      // collect users's info
      const user = await User.findById(req.user.id).select('+password');

      if (!user) {
        return res.status(404).json({message:'user not found'});
      }
      //check if the current password is valid
      const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (!isMatch) {
        return res.status(401).json({message:'Your current password is incorrect'});

      }
      //if password matched, update the current password with the new password
      user.password = req.body.newPassword;
      await user.save();

      //Create and Send a new token
      // const payload = { id: user.id, name: user.name, imageData:user.imageData, imageName:user.imageName };
      // createSendToken(payload, req, res);

      res.status(200).json(null)
    } catch (err) {
      next(err);
    }
  }
);

// @route   PATCH /api/v1/users/updateMe
// @desc    edit current user's profile
// @access  Private

router.patch(
  '/updateMe',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const { errors, isValid } = validateEditMeInput(req.body);

      if (!isValid) {
        return res.status(400).json({ errors });
      }

      const { name, photo } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { name, photo },
        { new: true }
      );
      res.status(200).json({
        status: 'success',
        data: updatedUser,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   GET /api/v1/users/deleteMe
// @desc    delete current user's profile. The user's info won't be deleted from database and only 'active' will be set to false.
// @access  Private

router.delete(
  '/deleteMe',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      await User.findByIdAndUpdate(req.user.id, { active: false });

      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   GET /api/v1/users/getMe
// @desc    get current user
// @access  Private

router.get(
  '/getMe',
  passport.authenticate('jwt', { session: false }),
  (req, res, next) => {
    try {
      res.status(200).json({
        status: 'success',
        data: {
          user: req.user,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// upload image in base64 format
// directly storing it in mongoDB
router.patch(
  '/upload-image',
  passport.authenticate('jwt', { session: false }),

  async (req, res, next) => {
    try {
      const result = await User.findByIdAndUpdate(
        req.user.id,
        {
          imageName: req.body.imageName,
          imageData: req.body.imageData,
        },
        { new: true }
      );

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;
