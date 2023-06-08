const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: "make the GET API call to the database" });
});
router.post("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, msg: "Create the API to be call in the database" });
});
router.put("/:id", (req, res) => {
  res.status(201).json({
    success: true,
    msg: `Create the API to be call in the database ${req.params.id}`
  });
});
router.delete("/:id", (req, res) => {
  res.status(200).json({
    success: true,
    msg: `Delete data from the database ${req.params.id}`
  });
});

module.exports = router;
