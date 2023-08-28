const express = require('express')
const {regUser, Login, getMe} = require('../controller/auth')

const router = express.Router();

const {protect} = require('../middleware/auth')

// router.route('/register').post(regUser)
router.post('/register', regUser)
router.post('/login', Login)
router.post('/me', protect, getMe)


module.exports = router;