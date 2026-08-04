const CinemaController = require('./CinemaController')
const { apiService } = require('../../composition/apiService')

describe('CinemaController', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('retrieves all cinemas and writes them to the response', async () => {
        const req = {}
        const res = { json: vi.fn() }
        const cinemas = [{ name: 'Cinema One' }]

        const retrieveAllCinemasSpy = vi.spyOn(apiService, 'retrieveAllCinemas').mockResolvedValueOnce(cinemas)

        await CinemaController.retrieveAll(req, res)

        expect(retrieveAllCinemasSpy).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith(cinemas)
    })

    it('parses query params for nearest cinemas', async () => {
        const req = { query: { lng: '2.17', lat: '41.40', dist: '500' } }
        const res = { json: vi.fn() }
        const cinemas = [{ location: { coordinates: [2.17, 41.4] } }]

        const retrieveNearestSpy = vi.spyOn(apiService, 'retrieveNearestCinemas').mockResolvedValueOnce(cinemas)

        await CinemaController.retrieveNearest(req, res)

        expect(retrieveNearestSpy).toHaveBeenCalledWith(2.17, 41.4, 500)
        expect(res.json).toHaveBeenCalledWith(cinemas)
    })
})