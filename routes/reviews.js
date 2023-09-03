const express = require("express");
const router = express.Router({ mergeParams: true });
const {protect, authorize} = require('../middleware/auth')
const Review = require('../model/Review')
const advancedResults = require('../middleware/advancedResults')


const {
    getReviews,
    getReview
  } = require("../controller/review");

  router.route("/").get(advancedResults(Review, {
    path: "bootcamp",
    select: "name description"
  }), getReviews)

  router.route('/:id').get(getReview)
  
  module.exports = router;