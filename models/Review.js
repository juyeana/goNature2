const mongoose = require('mongoose');
const Tour = require('./Tour');

const reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      // min: [1, 'Rating must be between 1 and 5'],
      // max: [5, 'Rating must be between 1 and 5'],
      required:true
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    // parent referencing
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: true,
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reviewSchema.index({ tour: 1, user: -1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//id: tour id
// this: current model
// count number of reviews and calculate average by review post
reviewSchema.statics.calcAverageRatings = async function (id) {
  const stats = await this.aggregate([
    { $match: { tour: id } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(id, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(id, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to the current Review model
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this middleware has only access to the query. But to delete or update, you need documents.
  // so execute the query first and store the result doc
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); : does NOT work here. query has already executed.
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

//
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
