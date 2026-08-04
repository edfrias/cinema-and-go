const express = require('express')
const userRoutes = require('./userRoutes')
const cinemaRoutes = require('./cinemaRoutes')

const router = express.Router()

router.use(userRoutes)
router.use(cinemaRoutes)

module.exports = router
