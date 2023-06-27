const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("color");

// load the dotenv file
dotenv.config({ path: "./config/config.env" });

// load the models
const Bootcamp = require("./model/BootcampModel");

// load the DB
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true
  // useFindOneAndUpdate: false
});

// Read the JSON file
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_dev/bootcamps.json`, "utf-8")
);

// import to the DB

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data was imported...".green);
  } catch (err) {
    console.log(err.red);
  }
};
