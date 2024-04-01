const User = require("../models/users");
const catchAsync = require("../utils/catchAsync");

exports.signup = catchAsync(async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: "success",
    user: newUser,
  });
});
