const CourseModel = require("../model/CourseModel");
const Bootcamp = require("../model/BootcampModel");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const advancedResults = require("../middleware/advancedResults");


// @desc        Get Courses
// @route       Get /api/v1/courses
// @route       Get /api/v1/bootcamps/:bootcampId/courses
// @access      Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  

  if (req.params.bootcampId) {
    const courses = await CourseModel.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    })
  } else {
     
    res.status(200).json(res.advancedResults)
    
  }
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
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

// Make sure user is the bootcamp owner 
if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
  return next(
    new ErrorResponse(`User with ID of ${req.user.id} is not authorize to add course to this bootcamp ${bootcamp._id}`, 401)
  );
}

  const course = await CourseModel.create(req.body)
  res.status(201).json({
    success: true,
    data: course
  });
});


// @desc       Update a Course
// @route      PUT /api/v1/courses/:id
// @access     Private
exports.updateCourse = asyncHandler(async (req, res, next) => {

  let course = await CourseModel.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.bootcampId}`),
      404
    );
  }

  // Make sure user is the course owner 
if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
  return next(
    new ErrorResponse(`User with ID of ${req.user.id} is not authorize to update course ${course._id}`, 401)
  );
} 

   course = await CourseModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
   })
  res.status(200).json({
    success: true,
    data: course
  });
});


// @desc       DELETE a Course
// @route      DELETE /api/v1/courses/:id
// @access     Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {

  let course = await CourseModel.findById(req.params.id)


  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.bootcampId}`),
      404
    );
  }

  // Make sure user is the course owner 
if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
  return next(
    new ErrorResponse(`User with ID of ${req.user.id} is not authorize to delete course ${course._id}`, 401)
  );
} 
 
    course.deleteOne()
    
    res.status(200).json({
    success: true,
    data: {}
  });
});


