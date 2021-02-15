const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./User');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      // maxlength: [40, 'A tour must have less than 40 characters'],
      // minlength: [2, 'A tour must have less than 2 characters'],
    },
    duration: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'easy, medium, or difficult is only allowed',
      },
    },

    price: {
      type: Number,
      required: true,
    },
    priceDiscount: {
      type: Number,
      // caveat: this validator only works when a new data is created.
      // update won't work.
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be between 1 and 5'],
      max: [5, 'Rating must be between 1 and 5'],
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
    },
    accomodations:[String],
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // MongoDB provides GeoJSON data to user geospatial data
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //lon,lat
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number], //lon,lat
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array, //for embedding guides

    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1 , ratingsAverage:-1});
tourSchema.index({slug:1});
tourSchema.index({startLocation:'2dsphere'})

// virtual field will be only availble virtually when you get data.
//as durationweeks are not stored in db, you CANNOT query for it.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//virtual populate
//referenced parent which is Tour can be virtually populated by review
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // tour field in the Review model
  localField: '_id',
});

//*** DOCUMENT MIDDLEWARES
// : run this before/after save() and create() data into the database,
//NOTE: these middleware work ONLY with save() and create()
//you can manipulate data before save
//* slug: it is a string showing on the url based on the relevant data
// 'my favorite tour' => slug: my-favorite-tour
//'this' points to the current document

//pre save hook , you can have multiple pre save hook!
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// reference: implement embedding tour guides
//this middleware will only work when a new document is created not when it's updated
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

//post save hook
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// })

// *** QUERY MIDDLEWARES
//'this' points to the current query
//^find : all query strings that starts with find-: find, findOne, etc..
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  // console.log(docs);

  next();
});

//AGGREGATION MIDDLEWARE
//'this' points to the current aggregation object

// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });
//use cases: some tours only available to special groups not to the public

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
