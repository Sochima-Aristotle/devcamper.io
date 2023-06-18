// @desc  log info to the console
const middle = (req, res, next) => {
  req.hello = "first middleware example";
  console.log("An Error just occured");
  next();
};

module.exports = middle;
