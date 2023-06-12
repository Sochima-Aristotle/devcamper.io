// @desc  Get all bootcamps
// @route  Get  /api/v1/bootcamps
// @access     Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: "make the GET API call to the database",
    example: req.hello
  });
};

// @desc  Get single bootcamp
// @route   Get /api/v1/bootcamps/:id
// @access     Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `To get one bootcame of this id ${req.params.id}`
  });
};

// @desc  Get all bootcamps
// @route   Post /api/v1/bootcamps
// @access     Private
exports.createBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Create the API to be call in the database ${req.params.id}`
  });
};

// @desc  Get all bootcamps
// @route  Put  /api/v1/bootcamps/:id
// @access     Private
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Updating the database with ${req.params.id}`
  });
};
// @desc  Delete all bootcamps
// @route  Put  /api/v1/bootcamps/:id
// @access     Private
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    msg: `Delete bootcamp ${req.params.id} from the database`
  });
};
