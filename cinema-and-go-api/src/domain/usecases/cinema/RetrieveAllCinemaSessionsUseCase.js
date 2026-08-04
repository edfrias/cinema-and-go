class RetrieveAllCinemaSessionsUseCase {
    constructor({ cinemaQueryRepository }) {
        this.cinemaQueryRepository = cinemaQueryRepository
    }

    execute(sessionId) {
        return this.cinemaQueryRepository.getCinemaSessionsById(sessionId)
    }
}

module.exports = { RetrieveAllCinemaSessionsUseCase }
