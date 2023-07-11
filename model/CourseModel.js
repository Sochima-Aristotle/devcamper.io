const mongoose = require("mongoose");
const bootcampSchema = require('./BootcampModel');

const BootcampModel = mongoose.model("BootcampModel", bootcampSchema);

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please add a course title"]
  },
  description: {
    type: String,
    required: [true, "Please add a Course description"]
  },
  weeks: {
    type: String,
    required: [true, "Please add the number of weeks"]
  },
  tuition: {
    type: Number,
    required: [true, "Please add the tuition cost"]
  },
  miniumSkill: {
    type: String,
    required: [true, "Please add the minimum skill required for this course"],
    enum: ["beginners", "intermidiate", "advanced"]
  },
  scholarshipAvilable: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: "BootcampModel",
    required: true
  }
});

module.exports = mongoose.model("Course", CourseSchema);
