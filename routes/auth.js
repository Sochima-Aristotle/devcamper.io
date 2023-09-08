const express = require("express");
const {
  regUser,
  Login,
  getMe,
  forgotPassword,
  resetPassword,
  updatedatails,
  updatePassword,
  logout
} = require("../controller/auth");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/register", regUser);
router.post("/login", Login);
router.get("/logout", logout);
router.post("/me", protect, authorize("admin", "publisher"), getMe);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/resetpassword/updatedetails", protect, updatedatails);
router.put("/resetpassword/updatepassword", protect, updatePassword);

module.exports = router;
