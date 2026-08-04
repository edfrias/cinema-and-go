class RetrieveCinemaUseCase {
    constructor({ cinemaQueryRepository }) {
        this.cinemaQueryRepository = cinemaQueryRepository
    }

    execute(cinemaId) {
        return this.cinemaQueryRepository.getCinemaById(cinemaId)
    }
}

module.exports = { RetrieveCinemaUseCase }
