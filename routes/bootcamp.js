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

const Bootcamp = require('../model/BootcampMode')
const advancedResults = require('../middleware/advancedResults')

// Include other resources
const CourseRouter = require('./courses')

router.route("/").get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(createBootcamps);
 
// Re-router into other resource router 
router.use('/:bootcampId/courses', CourseRouter)

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router.route('/:id/photo').put(BootcampPhoto)

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
module.exports = router;
