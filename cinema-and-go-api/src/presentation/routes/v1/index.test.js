process.env.JWT_SECRET = 'test-secret'

const request = require('supertest')
const jwt = require('jsonwebtoken')
const { LogicError } = require('../../../common/errors')

const { apiService } = require('../../../composition/apiService')
const { createApp } = require('../../../app')

describe('presentation routes v1', () => {
    let app
    let authToken

    beforeEach(() => {
        app = createApp()
        authToken = jwt.sign({ sub: 'user-123' }, process.env.JWT_SECRET)
        vi.restoreAllMocks()
    })

    describe('user routes', () => {
        it('registers a user through the presentation controller', async () => {
            const payload = { name: 'Alice', email: 'alice@mail.com', password: 'secret123' }
            const registerUserSpy = vi.spyOn(apiService, 'registerUser').mockResolvedValueOnce(undefined)

            const response = await request(app)
                .post('/api/users')
                .send(payload)

            expect(response.status).toBe(201)
            expect(response.body).toEqual({ message: 'Succeed on register user.' })
            expect(registerUserSpy).toHaveBeenCalledWith(payload.name, payload.email, payload.password)
        })

        it('returns a token when authenticating a user', async () => {
            const authenticateUserSpy = vi.spyOn(apiService, 'authenticateUser').mockResolvedValueOnce('user-123')

            const response = await request(app)
                .post('/api/users/auth')
                .send({ email: 'alice@mail.com', password: 'secret123' })

            expect(response.status).toBe(200)
            expect(response.body.token).toBeTruthy()
            expect(authenticateUserSpy).toHaveBeenCalledWith('alice@mail.com', 'secret123')
        })

        it('rejects protected routes without authorization', async () => {
            const response = await request(app).get('/api/users')

            expect(response.status).toBe(401)
            expect(response.body).toEqual({ error: 'Unauthorized' })
        })
    })

    describe('cinema routes', () => {
        it('retrieves all cinemas through the presentation controller', async () => {
            const retrieveAllCinemasSpy = vi.spyOn(apiService, 'retrieveAllCinemas').mockResolvedValueOnce([{ name: 'Cinema One' }])

            const response = await request(app)
                .get('/api/cinemas')
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(200)
            expect(response.body).toEqual([{ name: 'Cinema One' }])
            expect(retrieveAllCinemasSpy).toHaveBeenCalledTimes(1)
        })

        it('maps domain errors through handleErrors', async () => {
            vi.spyOn(apiService, 'retrieveCinema').mockRejectedValueOnce(new LogicError('cinema not found'))

            const response = await request(app)
                .get('/api/cinema/abc123')
                .set('Authorization', `Bearer ${authToken}`)

            expect(response.status).toBe(409)
            expect(response.body).toEqual({ error: 'cinema not found' })
        })

        it('returns 404 for unknown routes', async () => {
            const response = await request(app).get('/api/unknown')

            expect(response.status).toBe(404)
            expect(response.body).toEqual({ error: 'Not found.' })
        })
    })
})