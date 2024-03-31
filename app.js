const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tours");
const userRouter = require("./routes/users");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/error");

const app = express();

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// If we get to the route *, it means that none of the routes middleware we matched
app.all("*", (req, res, next) => {
  // As soon as next() receives sth, it assumes that it is an error and it will jump into globalerrorhandling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this Server!`, 404));
});

// Error Handling middleware
app.use(globalErrorHandler);

module.exports = app;
