const express = require("express");
const router = express.Router({ mergeParams: true });
const {protect} = require('../middleware/auth')
const Course = require('../model/CourseModel')
const advancedResults = require('../middleware/advancedResults')

const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse
} = require("../controller/curses");

router.route("/").get(advancedResults(Course, {
  path: "bootcamp",
  select: "name description"
}), getCourses).post(protect, addCourse);

router.route("/:id").get(getCourse).put(protect, updateCourse).delete(protect, deleteCourse)

module.exports = router;
