const CourseModel = require("../model/CourseModel");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc  Get Courses
// @route Get /api/v1/courses
// @route Get /api/v1/bootcamps/:bootcampId/courses
// @access     Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = CourseModel.find({ bootcamp: req.params.bootcampId });
  } else {
    query = CourseModel.find().populate({
      path: "bootcamp",
      select: "name description"
    });
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses
  });
});

// @desc  Get a single Course
// @route POST /api/v1/courses/:id
// @access     Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseModel.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: course
  });
});

// @desc  Get a single Course
// @route  POST /api/v1/bootcamps/:bootcampId/courses
// @access     Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await CourseModel.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description"
  });
  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({
    success: true,
    data: course
  });
});
