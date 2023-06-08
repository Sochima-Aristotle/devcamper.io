const express = require("express");
const dotenv = require("dotenv");

// routes file
const bootcamp = require("./routes/bootcamp");

// load the env var
dotenv.config({ path: "./config/config.env" });
const app = express();

// mount bootcamp routs
app.use("/api/v1/bootcamp", bootcamp);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port: ${PORT}`)
);
