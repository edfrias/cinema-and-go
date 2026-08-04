class ICinemaQueryRepository {
    async getAllCinemas() {
        throw new Error('Not implemented')
    }

    async getCinemaById(id) {
        throw new Error('Not implemented')
    }

    async getCinemaSessionsById(id) {
        throw new Error('Not implemented')
    }

    async getNearestCinemas(lng, lat, dist) {
        throw new Error('Not implemented')
    }
}

module.exports = ICinemaQueryRepository
