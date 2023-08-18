const express = require("express");
const router = express.Router();
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamp,
  deleteBootcamp,
  getBootcampInRadius
} = require("../controller/butcamps");
router.route("/").get(getBootcamps).post(createBootcamps);

// Include other resources
const CourseRouter = require('./courses')

// Re-router into other resource router 
router.use('/:bootcampId/courses', CourseRouter)

router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
