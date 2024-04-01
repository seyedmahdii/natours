const express = require("express");
const {
  getAllUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
} = require("../controllers/users");
const { signup, login } = require("../controllers/auth");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
