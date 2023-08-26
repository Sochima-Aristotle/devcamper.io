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

    const token = user.getSignedJwtToken()
    

    res.status(200).json({ success: true, token})
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
   
//    Create a token
   const token = user.getSignedJwtToken()
    res.status(200).json({ success: true, token})
  });