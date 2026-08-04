const IMovieSessionsRepository = require('../../../domain/interfaces/IMovieSessionsRepository')

class MovieSessionsRepository extends IMovieSessionsRepository {
    constructor(MovieSessionsModel) {
        super()
        this.MovieSessionsModel = MovieSessionsModel
    }

    createSessions(movie, sessions) {
        return this.MovieSessionsModel.create({ movie, sessions })
    }
}

module.exports = { MovieSessionsRepository }
