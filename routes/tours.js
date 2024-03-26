const express = require("express");
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  // checkId,
  // checkBody,
  aliasTopTours,
} = require("../controllers/tours");

const router = express.Router();

// router.param("id", checkId);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/").get(getAllTours).post(createTour);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
