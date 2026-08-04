const express = require('express')
const auth = require('../../middleware/auth')
const handleErrors = require('../../middleware/handleErrors')
const UserController = require('../../controllers/UserController')

const jsonParser = express.json()
const router = express.Router()

router.post('/users', jsonParser, (req, res) => {
    handleErrors(() => UserController.register(req, res), res)
})

router.post('/users/auth', jsonParser, (req, res) => {
    handleErrors(() => UserController.authenticate(req, res), res)
})

router.get('/users', auth, (req, res) => {
    handleErrors(() => UserController.retrieve(req, res), res)
})

router.put('/users/update', jsonParser, auth, (req, res) => {
    handleErrors(() => UserController.update(req, res), res)
})

router.delete('/users/delete', jsonParser, auth, (req, res) => {
    handleErrors(() => UserController.remove(req, res), res)
})

module.exports = router
