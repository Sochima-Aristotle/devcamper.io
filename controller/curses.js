const CourseModel = require("../model/CourseModel");
const Bootcamp = require("../model/BootcampModel");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");


// @desc        Get Courses
// @route       Get /api/v1/courses
// @route       Get /api/v1/bootcamps/:bootcampId/courses
// @access      Public
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

// @desc       Get a single Course
// @route      POST /api/v1/courses/:id
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

// @desc       Add a Course
// @route      POST /api/v1/bootcamps/:bootcampId/courses
// @access     Private
exports.addCourse = asyncHandler(async (req, res, next) => {

  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await CourseModel.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  const course = await CourseModel.create(req.body)
  res.status(200).json({
    success: true,
    data: course
  });
});


