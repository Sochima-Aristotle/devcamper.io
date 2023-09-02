
const express = require("express");
const router = express.Router({ mergeParams: true });
const {protect, authorize} = require('../middleware/auth')
const User = require('../model/User')
const advancedResults = require('../middleware/advancedResults')

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require("../controller/users");

router.use(protect)
router.use(authorize)

router.route("/")
.get(advancedResults(User), getUsers)
.post(createUser)

router.route("/:id")
.get(getUser)
.put(updateUser)
.delete(deleteUser)

module.exports = router;
