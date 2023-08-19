const BootcampModel = require("../model/BootcampModel");
const ErrorResponse = require("../utility/errorResponse");
const geocoder = require("../utility/geocoder");
const asyncHandler = require("../middleware/asyncHandler");


// @desc  Get all bootcamps
// @route  Get/api/v1/bootcamps
// @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  // copy reqest query
  const reqQuery = { ...req.query };

  // field execute
  const removeFields = ["select", "sort", "page", "limit"];

  // loop over removeField and delete them from the reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create string query
  let queryStr = JSON.stringify(reqQuery);

  // Operate the request query
  queryStr = queryStr.replace(
    /\b(gt|gte|it|ite|in)\b/g,
    (match) => `$${match}`
  );

  // find resources
  query = BootcampModel.find(JSON.parse(queryStr)).populate("courses");

  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // pagination;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await BootcampModel.countDocuments();

  query = query.skip(startIndex).limit(limit);
  // Executing query
  const getBoots = await query;

  // pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  } else if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  res.status(200).json({
    succcess: true,
    count: getBoots.length,
    pagination,
    data: getBoots
  });
});

// @desc  Get single bootcamp
// @route   Get /api/v1/bootcamps/:id
// @access     Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const getOneBoot = await BootcampModel.findById(req.params.id);
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

  const bootcamp = await BootcampModel.create(req.body);

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
  const upBoot = await BootcampModel.findByIdAndUpdate(
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
  const bootcamp = await BootcampModel.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

 await bootcamp.remove() // <=====

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc  Get bootcamps in radius
// @route  Get/api/v1/bootcamps/radius/:zipcode/:distance
// @access     Private
exports.getBootcampInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc the radius using radians
  // Divide the radius by the distance of the earth
  // Radius of the earth = 3963 mi / 6378 km

  const radius = distance / 3963;

  const bootcamps = await BootcampModel.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });
  res.status(200).json({
    succcess: true,
    count: bootcamps.length,
    data: bootcamps
  });
});
