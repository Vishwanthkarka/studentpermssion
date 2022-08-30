const express = require('express')
const router = express.Router()

const {home,HomeDummary} = require('../controller/homeContoller')

router.route("/").get(home)
router.route("/d").get(HomeDummary)
module.exports = router;
