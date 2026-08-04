const IMovieRepository = require('../../../domain/interfaces/IMovieRepository')

class MovieRepository extends IMovieRepository {
    constructor(MovieModel) {
        super()
        this.MovieModel = MovieModel
    }

    findByTitle(title) {
        return this.MovieModel.findOne({ title })
    }

    createMovie(data) {
        return this.MovieModel.create(data)
    }
}

module.exports = { MovieRepository }
