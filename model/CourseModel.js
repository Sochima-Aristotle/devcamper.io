const mongoose = require("mongoose");

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
  Weeks: {
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
    enum: ["beginners", "intermidiate", "advenced"]
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
