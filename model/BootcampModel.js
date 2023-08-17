const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utility/geocoder");

const BootcampSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// creating slug using slugify

BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// Creating of location using Geolocation
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    Street: loc[0].streetName,
    City: loc[0].city,
    Street: loc[0].streetCode,
    Zipcode: loc[0].zipcode,
    Country: loc[0].countryCode
  };
  // do not save address field to the db
  this.address = undefined;
  next();
});

// cascade delete courses when bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
  console.log(`Courses removed ${this._id}`);
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

// Reverse populate with virtuals
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false
});
module.exports = mongoose.model("Bootcamp", BootcampSchema);
