const express = require("express");
const {
  getAllUsers,
  getUser,
  deleteUser,
  createUser,
  updateUser,
} = require("../controllers/users");

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
