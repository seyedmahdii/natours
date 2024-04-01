const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, "Please provide a valid email"],
  },
  image: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please provide a password"],
    validate: {
      // This validator only works on CREATE and SAVE
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords do not match!",
    },
  },
});

usersSchema.pre("save", async function (next) {
  // Don't run the function if password is not modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // We don't need to store it in the DB
  next();
});

const User = mongoose.model("User", usersSchema);

module.exports = User;
