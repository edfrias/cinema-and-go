class RetrieveAllCinemasUseCase {
    constructor({ cinemaQueryRepository }) {
        this.cinemaQueryRepository = cinemaQueryRepository
    }

    execute() {
        return this.cinemaQueryRepository.getAllCinemas()
    }
}

module.exports = { RetrieveAllCinemasUseCase }
