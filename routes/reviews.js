const express = require("express");
const router = express.Router({ mergeParams: true });
const {protect, authorize} = require('../middleware/auth')
const Review = require('../model/Review')
const advancedResults = require('../middleware/advancedResults')


const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview
  } = require("../controller/review");

  router.route("/").get(advancedResults(Review, {
    path: "bootcamp",
    select: "name description"
  }), 
  getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview)

  router
  .route('/:id')
  .get(getReview).put(protect, authorize('user', 'admin'), updateReview).delete(protect, authorize('user', 'admin'), deleteReview)
  
  module.exports = router;