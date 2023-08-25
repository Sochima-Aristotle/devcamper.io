const express = require('express')
const {regUser} = require('../controller/auth')

const router = express.Router();

// router.route('/register').post(regUser)
router.post('/register', regUser)

module.exports = router;