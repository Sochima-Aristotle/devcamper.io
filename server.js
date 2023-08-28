const express = require("express");
const path = require("path")
const dotenv = require("dotenv");
const fileupload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const colors = require("colors");
const error = require("./middleware/errorHandle");


// const middle = require("./middleware/logger");
const morgan = require("morgan");
// load the env var
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");

// routes file
const bootcamp = require("./routes/bootcamp");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const middle = require("./middleware/logger");

// connect to db
connectDB();
const app = express();

// Body perser
app.use(express.json());

//Cookie parser
app.use(cookieParser())

// middleware;
// implementing morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(middle);
}


// file uploading
app.use(fileupload())

// set static folder 
app.use(express.static(path.join(__dirname, 'public')))

// mount bootcamp routs
app.use("/api/v1/bootcamp", bootcamp);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth)
// error middleware
app.use(error);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `server running in ${process.env.NODE_ENV} mode on port: ${PORT}`.yellow
  )
);

// on handle rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error of the unhandled rejection ${err.message}`);
  // close server and exit process
  server.close(() => process.exit(1));
});
