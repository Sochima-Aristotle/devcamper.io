const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");

// load the dotenv file
dotenv.config({ path: "./config/config.env" });

// load the models
const Bootcamp = require("./model/BootcampModel");
const Course = require("./model/CourseModel");

// load the DB
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true
  // useFindOneAndUpdate: false
});

// Read the JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_dev/Bootcamp.json`, "utf-8")
);
const Courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_dev/course.json`, "utf-8")
);

// import to the DB

const importData = async () => {
  try {
    // await Bootcamp.create(bootcamps);
    await Course.create(Courses);
    console.log("Data imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// Destroy the data from the DB
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("Data destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
