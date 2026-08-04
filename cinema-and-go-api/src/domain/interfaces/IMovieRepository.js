class IMovieRepository {
    async findByTitle(title) {
        throw new Error('Not implemented')
    }

    async createMovie(data) {
        throw new Error('Not implemented')
    }
}

module.exports = IMovieRepository
