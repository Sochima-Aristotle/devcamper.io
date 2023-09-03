const mongoose = require("mongoose");
// const bootcampSchema = require('./BootcampModel');


const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please add a review title"]
  },
  text: {
    type: String,
    required: [true, "Please add a review text"],
    maxlength: 150
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "Please add a rating betweening 1 and 10"]
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "Bootcamp",
    required: true
  }, 
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});


module.exports = mongoose.model("Review", ReviewSchema);
