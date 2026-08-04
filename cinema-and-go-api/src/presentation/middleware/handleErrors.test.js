const handleErrors = require('./handleErrors')
const { UnauthorizedError, LogicError } = require('../../common/errors')

describe('presentation handleErrors middleware wrapper', () => {
    it('maps UnauthorizedError from async flow to 401', async () => {
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        handleErrors(() => Promise.reject(new UnauthorizedError('Unauthorized')), res)

        await Promise.resolve()

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
    })

    it('maps LogicError from async flow to 409', async () => {
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        }

        handleErrors(() => Promise.reject(new LogicError('conflict')), res)

        await Promise.resolve()

        expect(res.status).toHaveBeenCalledWith(409)
        expect(res.json).toHaveBeenCalledWith({ error: 'conflict' })
    })
})