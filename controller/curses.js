const CourseModel = require("../model/CourseModel");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc  Get Courses
// @route  Get/api/v1/courses
// @route  Get/api/v1/bootcamps/:bootcampId/courses
// @access     Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = CourseModel.find({ bootcamp: req.params.bootcampId });
  } else {
    query = CourseModel.find();
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});
