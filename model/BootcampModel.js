const mongoose = require("mongoose");

const BootcampShema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name can't be more than 50 Characters"]
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please add name"]
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please input the URL"
    ]
  },
  Phone: {
    type: Number,
    maxlength: [20, "Phone number can't be more than 20 characters"]
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w([\.-]?\w+)*(\.\w{2,3})+$/,
      "please add a valid email"
    ],
    maxlength: [20, "Email can't be more than 20 characters"]
  },
  address: {
    type: String,
    require: true
  },
  location: {
    // Geojson Point
    type: {
      type: String,
      enum: ["Point"]
      // required: true
    },
    coordinates: {
      type: [Number]
      //  required: true
    },
    formattAddress: String,
    Street: String,
    City: String,
    State: String,
    zipCode: String,
    Country: String
  },
  careers: {
    // Arrey of string
    type: [String],
    required: true,
    enum: [
      "Web development",
      "mobile development",
      "UI/UX",
      "Data science",
      "Business",
      "Others"
    ]
  },
  avarageRating: {
    type: Number,
    min: [1, "Rating must be atleast 1"],
    max: [10, "Rating cannot be more than 10"]
  },
  avarageCost: Number,
  photo: {
    type: String,
    default: "no-phone.jpg"
  },
  housing: {
    type: Boolean,
    default: true
  },
  jobAssistance: {
    type: Boolean,
    default: true
  },
  jobGuarentee: {
    type: Boolean,
    default: true
  },
  acceptGi: {
    type: Boolean,
    default: true
  },
  createAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Bootcamp", BootcampShema);
