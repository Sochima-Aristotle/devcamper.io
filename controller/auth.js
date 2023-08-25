const User = require("../model/User");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");


// @desc       Register user
// @route      Get/api/v1/auth/register
// @access     Public
exports.regUser = asyncHandler(async (req, res, next) => {
 
    const {name, email, password, role} = req.body

    const user = await User.create({
        name,
        email,
        password,
        role
    })

    res.status(200).json({ success: true, mgs: 'user created and registered'})
  });