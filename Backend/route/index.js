const express = require('express')
const router = express.Router()
const apiRoute = require("./api")

router.use(process.env.BASE_URL,apiRoute)

module.exports = router