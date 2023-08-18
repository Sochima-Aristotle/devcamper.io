const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controller/curses");

router.route("/").get(getCourses);
router.route("/:id").get(getCourse); //.post(updateCourse).delete(deleteCourse);

module.exports = router;
