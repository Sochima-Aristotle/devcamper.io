const express = require('express')
const {regUser, Login} = require('../controller/auth')

const router = express.Router();

// router.route('/register').post(regUser)
router.post('/register', regUser)
router.post('/login', Login
)


module.exports = router;