const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const error = require("./middleware/errorHandle");
// const middle = require("./middleware/logger");
const morgan = require("morgan");
// load the env var
dotenv.config({ path: "./config/config.env" });
const connectDB = require("./config/db");

// routes file
const bootcamp = require("./routes/bootcamp");
const middle = require("./middleware/logger");

// connect to db
connectDB();
const app = express();

// Body perser
app.use(express.json());
// middleware;
// implementing morgan middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  app.use(middle);
}

// mount bootcamp routs
app.use("/api/v1/bootcamp", bootcamp);
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
