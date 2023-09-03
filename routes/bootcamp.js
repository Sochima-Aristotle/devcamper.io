const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamp,
  deleteBootcamp,
  BootcampPhoto,
  getBootcampInRadius
} = require("../controller/butcamps");

const {protect, authorize} = require('../middleware/auth')
const Bootcamp = require("../model/BootcampModel");
const advancedResults = require('../middleware/advancedResults')

// Include other resources
const CourseRouter = require('./courses')
const reviewRouter = require('./reviews')

router.route("/").get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamps);
 
// Re-router into other resource router 
router.use('/:bootcampId/courses', CourseRouter)
router.use('/:bootcampId/review', reviewRouter)

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router.route('/:id/photo').put(protect, authorize('admin', 'publisher'), BootcampPhoto)

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize('admin', 'publisher'), updateBootcamp)
  .delete(protect, authorize('admin', 'publisher'), deleteBootcamp);
module.exports = router;
