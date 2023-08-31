const path = require('path')
const BootcampModel = require("../model/BootcampModel");
const ErrorResponse = require("../utility/errorResponse");
const geocoder = require("../utility/geocoder");
const asyncHandler = require("../middleware/asyncHandler");


// @desc       Get all bootcamps
// @route      Get/api/v1/bootcamps
// @access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
 
  res.status(200).json(res.advancedResults);
});

// @desc       Get single bootcamp
// @route      Get /api/v1/bootcamps/:id
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

// @desc       Create all bootcamps
// @route      Post /api/v1/bootcamps
// @access     Private
exports.createBootcamps = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id

  // check for published bootcamp
  const publishedBootcamp = await BootcampModel.findOne({user: req.user.id})
  

// If the user is not an admin, they can only publish one bootcamp
if(publishedBootcamp && req.user.role !== 'admin'){
  return next(
    new ErrorResponse(`User with ID ${req.user.id} already published a bootcamp`, 400)
  );
}

  const bootcamp = await BootcampModel.create(req.body);

  res.status(201).json({
    success: true,
    msg: "I can get here",
    data: bootcamp
  });
});

// @desc       Update all bootcamps
// @route      Put/api/v1/bootcamps/:id
// @access     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let upBoot = await BootcampModel.findById(req.params.id);
  if (!upBoot) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is the bootcamp owner 
  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`User with ID of ${req.user.id} and name ${req.user.name} is not authorized to update this bootcamp`, 401)
    );
  }

  upBoot = await BootcampModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true
    }
  )

  res.status(200).json({
    success: true,
    data: upBoot
  });
});


// @desc       Delete all bootcamps
// @route      DELETE/api/v1/bootcamps/:id
// @access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

 // Make sure user is the bootcamp owner 
 if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
  return next(
    new ErrorResponse(`User with ID of ${req.user.id} and name ${req.user.name} is not authorized to delete this bootcamp`, 401)
  );
}

 await bootcamp.deleteOne() 

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc       Upload photo for bootcamps
// @route      PUT/api/v1/bootcamps/:id/photo
// @access     Private
exports.BootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await BootcampModel.findById(req.params.id);
  console.log(req.params.id);
  
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  if(!req.files){
    return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }

  const file = req.files.file
  console.log('isaiah god', req.files);
  

  // Make sure the file is an image
  if(!file.mimetype.startsWith('image')){
    return next(
      new ErrorResponse(`Please upload an image file`, 400)
    );
  }

  // check filesize 
  if(file.size >process.env.MAX_FILE_UPLOAD){
    return next(
      new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400)
    );
  }

   // Make sure user is the bootcamp owner 
   if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(`User with ID of ${req.user.id} and name ${req.user.name} is not authorized to upload photo to this bootcamp`, 401)
    );
  }


  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err =>{
    if(err){
      console.log(err);
      
      return next(
        new ErrorResponse(`Problem with file upload`, 500)
      );
    }
    await BootcampModel.findByIdAndUpdate(req.params.id, {photo: file.name})

    res.status(200).json({
      succcess: true,
      data: file.name
    })
  })
});

// @desc       Get bootcamps in radius
// @route      Get/api/v1/bootcamps/radius/:zipcode/:distance
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
