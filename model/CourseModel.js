const mongoose = require("mongoose");
// const bootcampSchema = require('./BootcampModel');


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
    ref: "Bootcamp",
    required: true
  }, 
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
});

// CourseSchema.static.getAverageCost = async function(bootcampId){
//   console.log("Calculating average cost of the bootcamp".blue.inverse);

//   const obj = await this.aggregate([
//     {
//       $match: {bootcamp: bootcampId}
//     },
//   {
//     $group:{
//       _id: '$bootcamp',
//       averageCost: {$avg: '$tuition'}
//     }
//   }
//   ])
//   console.log(obj);
  
// }

// // Call getAverageCost after save 
// CourseSchema.post('save', function(){
//   this.constructor.getAverageCost(this.bootcamp)
// })

// // Call getAverageCost before remove 
// CourseSchema.pre('remove', function(){
//   this.constructor.getAverageCost(this.bootcamp)

// })

// Define the static method on the schema
CourseSchema.statics.getAverageCost = async function(bootcampId) {
  // console.log("Calculating average cost of the bootcamp".blue.inverse);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' }
      }
    }
  ]);

  // console.log(obj);
  try {
   await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10
    })

  
  } catch (error) {
    console.log(error);
    
  }
  
};

// Call getAverageCost after save
CourseSchema.post('save', async function() {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchema.pre('remove', async function() {
  await this.constructor.getAverageCost(this.bootcamp);
});


module.exports = mongoose.model("Course", CourseSchema);
