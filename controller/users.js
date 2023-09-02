const User = require("../model/User");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");

// @desc       Get all user
// @route      GET/api/v1/auth/users
// @access     Private/admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult)
});

// @desc       Get single user
// @route      GET/api/v1/auth/user/:id
// @access     Private/admin
exports.getUser = asyncHandler(async (req, res, next) => {
   const user = await User.findById(res.params.id)

   res.status(200).json({
    success: true,
    data: user
   })
  });

// @desc       Get single user
// @route      POST/api/v1/auth/users
// @access     Private/admin
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create( res.body)
 
    res.status(201).json({
     success: true,
     data: user
    })
   });

// @desc       Updata user
// @route      PUT/api/v1/auth/users/:id
// @access     Private/admin
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(res.params.id, res.body, {
        new: true,
        runValidators: true
    })
 
    res.status(200).json({
     success: true,
     data: user
    })
   });

// @desc       Delete user
// @route      DELETE/api/v1/auth/users/:id
// @access     Private/admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
     await User.findByIdAndDelete(res.params.id)
 
    res.status(200).json({
     success: true,
     data: {}
    })
   });