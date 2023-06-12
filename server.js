const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
// const middle = require("./middleware/logger");
const morgan = require("morgan");

const connectDB = require("./config/db");

// routes file
const bootcamp = require("./routes/bootcamp");
const middle = require("./middleware/logger");

// load the env var
dotenv.config({ path: "./config/config.env" });
// connect to db
connectDB();
const app = express();

// middleware;
// implementing morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(middle);
}

// mount bootcamp routs
app.use("/api/v1/bootcamp", bootcamp);

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
