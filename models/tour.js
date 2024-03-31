const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour must have less or equal than 40 characters"],
      minlength: [10, "A tour must have more or equal than 40 characters"],
      // validate: [validator.isAlpha, "Tour name must only contain characters"],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either: easy,medium,difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // 'this' points to current document on NEW document creation
          return value < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a summary"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // Won't show up in the select fields (for internally use)
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// we don't use () => here because arrow function does not have its this keyword. 'this' in here refers to the current document
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// pre middleware: it's gonna run before an actual event
// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre("save", function (next) {
  // this here is the created document
  this.slug = slugify(this.name, { lower: true });
  next();
});

// runs after all the pre middleware functions have completed
// tourSchema.post("save", function (doc, next) {
//   // this here is the created document
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// QUERY MIDDLEWARE
// find, findOne, findOneAndDelete, ...
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre("find", function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
