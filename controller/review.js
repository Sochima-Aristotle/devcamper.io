const Review = require("../model/BootcampModel");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
const advancedResults = require("../middleware/advancedResults");

// @desc        Get Course Reviews
// @route       Get /api/v1/reviews
// @route       Get /api/v1/bootcamps/:bootcampId/reviews
// @access      Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  

    if (req.params.bootcampId) {
      const review = await Review.find({ bootcamp: req.params.bootcampId });
      console.log(review);
      
  
      return res.status(200).json({
        success: true,
        count: review.length,
        data: review
      })
    } else {
      res.status(200).json(res.advancedResults)
    }
  });


// @desc        Get single Course Reviews
// @route       Get /api/v1/reviews/:id
// @access      Public
exports.getReview = asyncHandler(async (req, res, next) => {
  
const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
})
     if(!review){
        return next(new ErrorResponse(`No review found with an id of ${req.params.id}`, 404))
     }
     
     res.status(200).json({
    success: true,
    data: review
     })
  });