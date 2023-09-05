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
    // maxlength: 150
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

// prevent users from adding multiple reviews 
ReviewSchema.index({Bootcamp: 1, user: 1}, {unique: true})

 
// Define the static method on the schema
ReviewSchema.statics.getAverageRating = async function(bootcampId) {
  // console.log("Calculating average cost of the bootcamp".blue.inverse);

  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId }
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' }
      }
    }
  ]);

  try {
    console.log("revie",obj[0]);
    if (obj[0]) {
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageRating: obj[0].averageRating.toFixed(1),
        // averageRating
      });
    } else {
      await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
        averageRating: undefined,
      });
    }
  }  catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save 
ReviewSchema.post('save',async function(){
  await this.constructor.getAverageRating(this.bootcamp)
  // console.log('this calculates before saving',cal);
  
})

// Call getAverageCost before remove 
ReviewSchema.pre('remove',async function(){
  await this.constructor.getAverageRating(this.bootcamp)
  // console.log('this calculates before removing',cal);
})



module.exports = mongoose.model("Review", ReviewSchema);
