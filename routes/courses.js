const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getCourses,
  getCourse,
  addCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controller/curses");

router.route("/").get(getCourses).post(addCourse);
router.route("/:id").get(getCourse) //.delete(deleteCourse);

module.exports = router;
