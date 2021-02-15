const express = require('express');
const passport = require('passport');

const Tour = require('../../models/Tour');
const tourFeatures = require('../../utils/tourFeatures');
const AppError = require('../../utils/appError');
const validateTourInput = require('../../validation/tour');
const accessControl = require('../../admin/accessControl');
const reviews = require('./reviews');
const APIFeatures = require('./../../utils/apiFeatures');

const router = express.Router();

// whenever route starts with '/:id' use reviews router
// :id => tour id
router.use('/:id/reviews', reviews);

// @route   GET /api/v1/tours
// @desc    get all tours
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    // console.log(req.query);
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // **** to get query statistics : use explain()
    // const tours = await features.query.explain();
    const tours = await features.query;

    //send response
    res.json(tours);
    // res.status(200).json({
    //   status: 'success',
    //   results: tours.length,
    //   requestedAt: req.requestTime,
    //   // results: tourData.length,
    //   data: {
    //     tours,
    //   },
    // });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/v1/tours/top5
// @desc    get top 5 favorite tours
// @access  Public

router.get('/top5', tourFeatures.topFavoriteTours, async (req, res, next) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    //send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      requestedAt: req.requestTime,
      // results: tourData.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/v1/tours/tour-stats
// @desc    get statistics with MongoDB aggregation pipeline operations Matching & Grouping
// @access  Public

router.get('/tour-stats', async (req, res, next) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' }, //this _id field is used to group by a specific field based on the results of aggregation operations below. __id value can be 'null' to begin with.
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          aveRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { aveRating: 1 }, //1 : ascending order //-1: descending order
      },
      // {
      //   $match : {_id:{$ne:'EASY'}} //excluding difficulty: 'EASY'
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/v1/tours/MonthlyPlans
// @desc    get monthly plans based on tour schedules - with MongoDB aggregation operations: unwinding & projecting
// @access  Private

router.get(
  '/monthly-plan/:year',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('admin', 'lead-guide', 'guide'),

  async (req, res, next) => {
    try {
      const year = req.params.year * 1;

      const plan = await Tour.aggregate([
        {
          $unwind: '$startDates', //take all startDates from its array and make them to a individual tour.
        },
        {
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte: new Date(`${year}-12-31`),
            },
          },
        },

        {
          $group: {
            _id: { $month: '$startDates' },
            numTours: { $sum: 1 },
            tours: { $push: '$name' },
          },
        },
        {
          $addFields: { month: '$_id' },
        },

        {
          $project: {
            _id: 0, //to display _id: 1
          },
        },
        {
          $sort: {
            numTours: -1,
          },
        },
        // {
        //   $limit: 6,
        // },
      ]);

      res.status(200).json({
        status: 'success',
        length: plan.length,
        data: {
          plan,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   GET /api/v1/tours/:id
// @desc    get tour by tour id
// @access  Public

router.get('/:id', async (req, res, next) => {
  // console.log(req.params.id)
  try {
    const tour = await Tour.findById(req.params.id).populate('reviews');
    if (!tour) {
      return next(new AppError('No tour found with that ID', 404));
    }
    res.status(200).json(tour);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/v1/tours/tours-within/:distance/center/:latlng/unit/:unit
// @desc    find tour within a certain distance from where you are
// @access  Public

router.get(
  '/tours-within/:distance/center/:latlng/unit/:unit',
  async (req, res, next) => {
    try {
      const { distance, latlng, unit } = req.params;
      const [lat, lng] = latlng.split(',');

      const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
      // console.log(req.params);
      if (!lat || !lng) {
        next(
          new AppError(
            'Please provide latitutr and longitude in the format lat,lng.',
            400
          )
        );
      }

      const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
      });

      res.status(200).json(tours);
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST /api/v1/tours/distances/:latlng/unit/:unit
// @desc    find all distances of tours from where you are
// @access  Public

router.get('/distances/:latlng/unit/:unit', async (req, res, next) => {
  try {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
    if (!lat || !lng) {
      next(
        new AppError(
          'Please provide latitutr and longitude in the format lat,lng.',
          400
        )
      );
    }

    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lng * 1, lat * 1],
          },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: distances.length,
      data: {
        data: distances,
      },
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/v1/tours
// @desc    create a tour
// @access  Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('admin', 'lead-guide'),
  async (req, res, next) => {
    //const newTour = new Tour(req.body);
    //newTour.save();
    try {
      const { errors, isValid } = validateTourInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const newTour = await Tour.create(req.body);

      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   DELETE /api/v1/tours/:id
// @desc    delete a tour by tour id
// @access  Private

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('admin', 'lead-guide'),
  async (req, res, next) => {
    try {
      const tour = await Tour.findByIdAndDelete(req.params.id);
      if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   PATCH /api/v1/tours/:id
// @desc    update a tour by tour id
// @access  Private

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  accessControl.restrictTo('admin', 'lead-guide'),
  async (req, res, next) => {
    try {
      const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        // runValidators: true,
      });

      if (!tour) {
        return next(new AppError('No tour found with that ID', 404));
      }

      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
