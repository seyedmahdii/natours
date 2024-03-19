const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tours");
const userRouter = require("./routes/users");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
