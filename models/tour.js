const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
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

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
