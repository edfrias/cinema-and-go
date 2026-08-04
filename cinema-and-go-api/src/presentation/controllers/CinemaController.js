const { apiService } = require('../../composition/apiService')

const CinemaController = {
    async retrieveDistance(req, res) {
        const { query: { defaultPos, cinemaLocation, MAPS_KEY } } = req

        const distance = await apiService.setCinemaLocation(defaultPos, cinemaLocation, MAPS_KEY)

        return res.json(distance)
    },

    async retrieveAll(req, res) {
        const cinemas = await apiService.retrieveAllCinemas()

        return res.json(cinemas)
    },

    async retrieveOne(req, res) {
        const { params: { cinemaId } } = req

        const cinema = await apiService.retrieveCinema(cinemaId)

        return res.json(cinema)
    },

    async retrieveSessions(req, res) {
        const { params: { sessionId } } = req

        const sessions = await apiService.retrieveAllCinemaSessions(sessionId)

        return res.json(sessions)
    },

    async runScrapper(req, res) {
        await apiService.scrapCinemaMovies()

        return res.status(200).json({ message: 'Actions were successfully done' })
    },

    async retrieveNearest(req, res) {
        const { query: { lng, lat, dist } } = req

        const cinemas = await apiService.retrieveNearestCinemas(parseFloat(lng), parseFloat(lat), parseFloat(dist))

        return res.json(cinemas)
    }
}

module.exports = CinemaController
