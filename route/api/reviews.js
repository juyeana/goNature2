const express = require('express');
const passport = require('passport');
const Review = require('../../models/Review');
const AppError = require('../../utils/appError');
const accessControl = require('../../admin/accessControl');
const validateReviewInput = require('../../validation/review');

// 'mergeParams' will take parent router's parameters. In this case 'tourId'
// POST /tour/:tourId/review will work

const router = express.Router({ mergeParams: true });

// @route GET /api/v1/reviews
// @route GET /api/v1/tours/:id/reviews
// @desc get all reviews OR get all reviews on tour
// @access Public
router.get('/', async (req, res, next) => {
  try {
    let filter = {};
    if (req.params.id) filter = { tour: req.params.id };
    const reviews = await Review.find(filter);
    if (reviews) {
      res.status(200).json(reviews);
    }
  } catch (err) {
    next(err);
  }
});

// @route GET /api/v1/reviews/:id
// @desc get a review by tour id
// @access Public
router.get('/:id', async (req, res, next) => {
  try {
    const review = await Review.findOne({tour:req.params.id});
    if (review) {
      res.status(200).json(reviews);
    }
  } catch (err) {
    next(err);
  }
});


// @route POST /api/v1/tours/:id/reviews
// @desc post a review
// @access Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('user'),
  async (req, res, next) => {
    try {
      const {errors, isValid} = validateReviewInput(req.body, {session: false})

      if(!isValid){
        return res.status(400).json(errors)
      }

      // multiple reviews on a tour by the same user is not allowed 
      const isExist = await Review.findOne({tour:req.params.id, user:req.user.id})

      if(isExist){
        return next(new  AppError('Your review on this tour already exists'))
      }
      const { review, rating } = req.body;

      const newReview = await Review.create({
        review,
        rating,
        tour: req.params.id,
        user: req.user.id,
      });

      res.status(200).json({
        status: 'success',
        data: newReview,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route PATCH /api/v1/reviews/:id
// @desc update review
// @access Private

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('user', 'admin'),

  async (req, res, next) => {
    try {
      const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!review) {
        return next(new AppError('No review found with that ID', 404));
      }

      res.status(200).json(review);
    } catch (err) {
      next(err);
    }
  }
);

// @route DELETE /api/v1/reviews/:id
// @desc delete a review
// @access Private

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('user', 'admin'),

  async (req, res, next) => {
    try {
      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
