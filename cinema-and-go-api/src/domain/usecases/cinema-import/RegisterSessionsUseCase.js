class RegisterSessionsUseCase {
    constructor({ movieSessionsRepository }) {
        this.movieSessionsRepository = movieSessionsRepository
    }

    execute(movie, sessions) {
        return this.movieSessionsRepository.createSessions(movie, sessions)
    }
}

module.exports = { RegisterSessionsUseCase }
