process.env.JWT_SECRET = 'test-secret'

const jwt = require('jsonwebtoken')
const UserController = require('./UserController')
const { apiService } = require('../../composition/apiService')

describe('UserController', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('registers a user and returns 201 payload', async () => {
        const req = { body: { name: 'Alice', email: 'alice@mail.com', password: 'secret123' } }
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        const registerUserSpy = vi.spyOn(apiService, 'registerUser').mockResolvedValueOnce(undefined)

        await UserController.register(req, res)

        expect(registerUserSpy).toHaveBeenCalledWith('Alice', 'alice@mail.com', 'secret123')
        expect(res.status).toHaveBeenCalledWith(201)
        expect(res.json).toHaveBeenCalledWith({ message: 'Succeed on register user.' })
    })

    it('authenticates a user and signs a token', async () => {
        const req = { body: { email: 'alice@mail.com', password: 'secret123' } }
        const res = { json: vi.fn() }

        vi.spyOn(apiService, 'authenticateUser').mockResolvedValueOnce('user-123')

        await UserController.authenticate(req, res)

        const token = res.json.mock.calls[0][0].token
        expect(jwt.verify(token, process.env.JWT_SECRET).sub).toBe('user-123')
    })
})