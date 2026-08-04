const { runPopulate } = require('./runPopulate')

describe('runPopulate', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('connects, runs population, and disconnects', async () => {
        const connect = vi.fn().mockResolvedValueOnce(undefined)
        const disconnect = vi.fn().mockResolvedValueOnce(undefined)
        const scrapCinemaMovies = vi.fn().mockResolvedValueOnce(undefined)
        const log = vi.fn()
        const error = vi.fn()

        await runPopulate({
            mongoose: { connect, disconnect },
            url: 'mongodb://localhost/test-db',
            apiService: { scrapCinemaMovies },
            logger: { log, error }
        })

        expect(connect).toHaveBeenCalledWith('mongodb://localhost/test-db')
        expect(scrapCinemaMovies).toHaveBeenCalledTimes(1)
        expect(disconnect).toHaveBeenCalledTimes(1)
        expect(log).toHaveBeenCalledWith('connected to database')
        expect(error).not.toHaveBeenCalled()
    })

    it('disconnects and rethrows if population fails', async () => {
        const connect = vi.fn().mockResolvedValueOnce(undefined)
        const disconnect = vi.fn().mockResolvedValueOnce(undefined)
        const boom = new Error('population failed')
        const scrapCinemaMovies = vi.fn().mockRejectedValueOnce(boom)
        const log = vi.fn()
        const error = vi.fn()

        await expect(runPopulate({
            mongoose: { connect, disconnect },
            url: 'mongodb://localhost/test-db',
            apiService: { scrapCinemaMovies },
            logger: { log, error }
        })).rejects.toThrow('population failed')

        expect(connect).toHaveBeenCalledWith('mongodb://localhost/test-db')
        expect(disconnect).toHaveBeenCalledTimes(1)
        expect(error).toHaveBeenCalledWith(boom, 'population failed')
    })
})