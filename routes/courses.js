const express = require("express");
const router = express.Router();

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controller/curses");

router.route("/").get(getCourses);

module.exports = router;
