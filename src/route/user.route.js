
const router = require('express').Router()
const controller = require('../controller/user.controller')
const upload = require('../ultils/handleFile')

router.post('/receive-otp', controller.insertOtp)
router.post('/verify-otp', controller.verifyOtp)
router.post('/create-account', upload.single('avatar'), controller.createAccount)


module.exports = router