const jwt = require('jsonwebtoken')
const { apiService } = require('../../composition/apiService')

const { env: { JWT_SECRET } } = process

const UserController = {
    async register(req, res) {
        const { body: { name, email, password } } = req

        await apiService.registerUser(name, email, password)

        return res.status(201).json({ message: 'Succeed on register user.' })
    },

    async authenticate(req, res) {
        const { body: { email, password } } = req

        const sub = await apiService.authenticateUser(email, password)
        const token = jwt.sign({ sub }, JWT_SECRET, { expiresIn: '2h' })

        return res.json({ token })
    },

    async retrieve(req, res) {
        const { userId } = req

        const user = await apiService.retrieveUser(userId)

        return res.json(user)
    },

    async update(req, res) {
        const { userId, body } = req

        await apiService.updateUser(userId, body)

        return res.status(201).json({ message: 'Succeed on update user.' })
    },

    async remove(req, res) {
        const { userId } = req

        await apiService.removeUser(userId)

        return res.json({ message: 'Ok, user deleted.' })
    }
}

module.exports = UserController
