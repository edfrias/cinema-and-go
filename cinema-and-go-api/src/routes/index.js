const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const logic = require('../logic')
const handleErrors = require('../middlewares/handleErrors')
const auth = require('../middlewares/auth')

const { env: { JWT_SECRET } } = process

const jsonParser = bodyParser.json()

const router = express.Router()

router.post('/users', jsonParser, (req, res) => {
    const { body: { name, email, password } } = req

    handleErrors(async () => {
        await logic.registerUser(name, email, password)

        return res.status(201).json({ message: 'Succeed on register user.' })
    }, res)
})

router.post('/users/auth', jsonParser, (req, res) => {
    const { body: { email, password } } = req

    handleErrors(async () => {
        const sub = await logic.authenticateUser(email, password)

        const token = jwt.sign({ sub }, JWT_SECRET, { expiresIn: '2h' })

        return res.json({ token })
    }, res)
})

router.get('/users', auth, (req, res) => {
    const { userId } = req

    handleErrors(async () => {
        const user = await logic.retrieveUser(userId)

        return res.json(user)
    }, res)
})

router.put('/users/update', jsonParser, auth, (req, res) => {
    const { userId, body } = req

    handleErrors(async () => {
        await logic.updateUser(userId, body)

        return res.status(201).json({ message: 'Succeed on update user.' })
    }, res)
})

router.delete('/users/delete', jsonParser, auth, (req, res) => {
    const { userId, body: { email, password } } = req

    handleErrors(async () => {
        await logic.deleteUser(userId, email, password)

        return res.json({ message: 'Ok, user deleted.' })
    }, res)()
})

router.get('/user/distance/cinema', auth, (req, res) => {

    const { query: { defaultPos, cinemaId, cinemaLocation, MAPS_KEY }, userId } = req

    handleErrors(async () => {

        const distance = await logic.setCinemaLocation(defaultPos, cinemaLocation, MAPS_KEY)
        //const distance = await logic.retrieveCinemaLocation(cinemaId, userId, defaultPos, cinemaLocation, MAPS_KEY)

        return res.json(distance)
    }, res)
})

router.get('/cinemas', auth, (req, res) => {
    handleErrors(async () => {
        const cinemas = await logic.retrieveAllCinemas()

        return res.json(cinemas)
    }, res)
})

router.get('/cinema/:cinemaId', auth, (req, res) => {
    const { params: { cinemaId } } = req

    handleErrors(async () => {
        const cinema = await logic.retrieveCinema(cinemaId)

        return res.json(cinema)
    }, res)
})

router.get('/cinema/sessions/:sessionId', auth, (req, res) => {
    const { params: { sessionId } } = req

    handleErrors(async () => {
        const sessions = await logic.retrieveAllCinemaSessions(sessionId)

        return res.json(sessions)
    }, res)
})

router.post('/cinemas/scrapper', auth, (req, res) => {
    return (async() => {
        await logic.scrapCinemaMovies()

        return res.status(200).json({message: 'Actions were successfully done'})
    })()
})

router.get('/cinemas/near', auth, (req, res) => {
    const { query: { lng, lat, dist } } = req
    return (async () => {
        const cinemas = await logic.retireveNearestCinemas(parseFloat(lng), parseFloat(lat), parseFloat(dist))

        return res.json(cinemas)
    })()
})

module.exports = router
