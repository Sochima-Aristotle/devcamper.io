// @desc  log info to the console
const middle = (req, res, next) => {
  req.hello = "first middleware example";
  console.log("hit the ground running");
  next();
};

module.exports = middle