const User = require("../model/User");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const sendEmail = require("../utility/sendEmail");
const crypto = require("crypto");

// @desc       Register user
// @route      POST/api/v1/auth/register
// @access     Public
exports.regUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  sendTokenResponse(user, 200, res);
});

// @desc       Login user
// @route      POST/api/v1/auth/register
// @access     Public
exports.Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check for validation
  if (!email || !password) {
    return next(new ErrorResponse("Please enter an email or password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invaid credentials", 401));
  }

  // check if password match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invaid Credentials", 401));
  }

  sendTokenResponse(user, 200, res);
});


// @desc       Get current logged in user
// @route      POST/api/v1/auth/me
// @access     Private
exports.getMe = asyncHandler(async (req, res, next) => {
 
    const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc       Get details
// @route      PUT/api/v1/auth/updatedetails
// @access     Private
exports.updatedatails = asyncHandler(async (req, res, next) => {

    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    }

  const user = await User.findById(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  
    res.status(200).json({
      success: true,
      data: user,
    });
  });

// @desc       Updata password
// @route      PUT/api/v1/auth/updatepassword
// @access     Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
 
    const user = await User.findById(req.user.id).select('+password');
    if(!(await user.matchPassword(req.body.currentPassword))){
        return next(new ErrorResponse('Incorrect Password', 401))
    }
 user.password = req.body.newPassword
 await user.save()

  sendTokenResponse(user, 200, res)
});

// @desc       Forgot password
// @route      GET/api/v1/auth/
// @access     Private
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new ErrorResponse(`No user found with this email ${req.body.email}`, 404)
    );
  }

  //    get reset token
  const resetToken = user.getResetPasswordToken();
  //  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetpassword/${resetToken}`;

  const message = `You are recieving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({
      success: true,
      data: "Email sent",
    });
  } catch (error) {
    console.log(error);
    (user.resetPasswordToken = undefined),
      (user.resetPasswordExpire = undefined);
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc       Reset password
// @route      PUT/api/v1/auth/resetpassword/:resettoken
// @access     Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  console.log('params:', req.params.resettoken);
  
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
    console.log('token:', resetPasswordToken);
    
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
console.log('this user', user);

  if (!user) {
    return next(
      new ErrorResponse(`No user found with this email`, 400)
    );
  }

  // set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
console.log('this is the user:', user);

  await user.save();
  sendTokenResponse(user, 200, res);
});

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if ((process.env.NODE_ENV = "production")) {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
