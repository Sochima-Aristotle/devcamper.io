const Review = require("../model/Review");
const ErrorResponse = require("../utility/errorResponse");
const asyncHandler = require("../middleware/asyncHandler");
// const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require('../model/BootcampModel');

// @desc        Get Course Reviews
// @route       Get /api/v1/reviews
// @route       Get /api/v1/bootcamp/:bootcampId/review
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

// @desc       Add Course review
// @route      POST /api/v1/bootcamp/:bootcampId/reviews
// @access     Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});


// @desc       Update Course review
// @route      PUT /api/v1/reviews/:id
// @access     Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(
        `No review with the id of ${req.params.id}`,
        404
      )
    );
  }

  // make sure review belongs to a user or an admin 
  if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(
      new ErrorResponse(
        `Not authorized to update review`,
        401
      )
    );
  }
 review = await Review.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
  runValidators: true
 })
  res.status(200).json({
    success: true,
    data: review
  });
});


// @desc       DELETE a review
// @route      DELETE /api/v1/reviews/:id
// @access     Private
exports.deleteReview = asyncHandler(async (req, res, next) => {

  let review = await Review.findById(req.params.id)


  if (!review) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }

  // Make sure user is the course owner 
if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
  return next(
    new ErrorResponse(`User with ID of ${req.user.id} is not authorize to delete course ${course._id}`, 401)
  );
} 
   
    await review.deleteOne()
    
    res.status(200).json({
    success: true,
    data: {}
  });
});


