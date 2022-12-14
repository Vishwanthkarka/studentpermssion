const express = require('express')
const router = express.Router()

const  {signup,login,logout,forgotPassword,passwordReset} = require('../controller/userController')

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout',logout)
router.route('/forgotpassword').post(forgotPassword)
router.route('/password/reset/:token').post(passwordReset)

module.exports = router;