// const BootcampModel = require("../model/BootcampModel");
const BootCampModel = require("../model/BootcampModel");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc  Get all bootcamps
// @route  Get/api/v1/bootcamps
// @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const getBoots = await BootCampModel.find();

  res.status(200).json({
    succcess: true,
    count: getBoots.length,
    data: getBoots
  });
});

// @desc  Get single bootcamp
// @route   Get /api/v1/bootcamps/:id
// @access     Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const getOneBoot = await BootCampModel.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: getOneBoot
  });
  if (!getOneBoot) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
});

// @desc  Create all bootcamps
// @route   Post /api/v1/bootcamps
// @access     Private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
  console.log(req.body);

  const bootcamp = await BootCampModel.create(req.body);

  res.status(201).json({
    success: true,
    msg: "I can get here",
    data: bootcamp
  });
});

// @desc  Update all bootcamps
// @route  Put/api/v1/bootcamps/:id
// @access     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const upBoot = await BootCampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  );
  if (!upBoot) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: upBoot
  });
});
// @desc  Delete all bootcamps
// @route  delete/api/v1/bootcamps/:id
// @access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const delBoot = await BootCampModel.findByIdAndDelete(req.params.id);
  if (!delBoot) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: {}
  });
});
