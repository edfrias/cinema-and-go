class RetrieveNearestCinemasUseCase {
    constructor({ cinemaQueryRepository }) {
        this.cinemaQueryRepository = cinemaQueryRepository
    }

    execute(lng, lat, dist) {
        return this.cinemaQueryRepository.getNearestCinemas(lng, lat, dist)
    }
}

module.exports = { RetrieveNearestCinemasUseCase }
