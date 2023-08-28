 const User = require("../model/User")
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");


// @desc       Register user
// @route      POST/api/v1/auth/register
// @access     Public
exports.regUser = asyncHandler(async (req, res, next) => {
 
    const {name, email, password, role} = req.body
    
    
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    sendTokenResponse(user, 200, res)
  });


// @desc       Login user
// @route      POST/api/v1/auth/register
// @access     Public
exports.Login = asyncHandler(async (req, res, next) => {
 
    const {email, password} = req.body
    
    // check for validation 
    if(!email || !password){
        return next(new ErrorResponse('Please enter an email or password', 400))
    }

   const user = await User.findOne({email}).select('+password')

   if(!user){
    return next(new ErrorResponse('Invaid credentials', 401))
   }

   // check if password match
   const isMatch = await user.matchPassword(password)
  
   
  
   if(!isMatch){
    return next(new ErrorResponse('Invaid Credentials', 401))
   }
   
   sendTokenResponse(user, 200, res)
  });

  //Get token from model, create cookie and send response
  const sendTokenResponse = (user, statusCode, res) =>{
    // Create token
    const token = user.getSignedJwtToken()

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 *60 * 60 * 1000), 
        httpOnly: true
    };

    if(process.env.NODE_ENV ='production'){
        options.secure = true;
    }

    res 
       .status(statusCode)
       .cookie('token', token, options)
       .json({
        success: true,
        token
       })
  }

// @desc       Get current logged in user
// @route      GET/api/v1/auth/me
// @access     Private
exports.getMe = asyncHandler(async (req, res, next) =>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        data: user
    })
})