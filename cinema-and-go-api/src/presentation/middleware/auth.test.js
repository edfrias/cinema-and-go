process.env.JWT_SECRET = 'test-secret'

const jwt = require('jsonwebtoken')
const auth = require('./auth')

describe('presentation auth middleware wrapper', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('injects userId from a valid bearer token', async () => {
        const token = jwt.sign({ sub: 'user-123' }, process.env.JWT_SECRET)
        const req = { headers: { authorization: `Bearer ${token}` } }
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        const next = vi.fn()

        auth(req, res, next)

        await Promise.resolve()

        expect(req.userId).toBe('user-123')
        expect(next).toHaveBeenCalledTimes(1)
        expect(res.status).not.toHaveBeenCalled()
    })

    it('returns 401 when authorization header is missing', async () => {
        const req = { headers: {} }
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }
        const next = vi.fn()

        auth(req, res, next)

        await Promise.resolve()
        await Promise.resolve()

        expect(next).not.toHaveBeenCalled()
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })
})