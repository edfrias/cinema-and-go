const express = require('express')
const auth = require('../../middleware/auth')
const handleErrors = require('../../middleware/handleErrors')
const CinemaController = require('../../controllers/CinemaController')

const router = express.Router()

router.get('/user/distance/cinema', auth, (req, res) => {
    handleErrors(() => CinemaController.retrieveDistance(req, res), res)
})

router.get('/cinemas', auth, (req, res) => {
    handleErrors(() => CinemaController.retrieveAll(req, res), res)
})

router.get('/cinema/:cinemaId', auth, (req, res) => {
    handleErrors(() => CinemaController.retrieveOne(req, res), res)
})

router.get('/cinema/sessions/:sessionId', auth, (req, res) => {
    handleErrors(() => CinemaController.retrieveSessions(req, res), res)
})

router.post('/cinemas/scrapper', auth, (req, res) => {
    handleErrors(() => CinemaController.runScrapper(req, res), res)
})

router.get('/cinemas/near', auth, (req, res) => {
    handleErrors(() => CinemaController.retrieveNearest(req, res), res)
})

module.exports = router
