class RegisterMovieUseCase {
    constructor({ movieRepository }) {
        this.movieRepository = movieRepository
    }

    async execute(title, img, info, cast) {
        const exists = await this.movieRepository.findByTitle(title)
        if (exists) return exists._id

        const insertedMovie = await this.movieRepository.createMovie({ title, img, info, cast })

        return insertedMovie._id
    }
}

module.exports = { RegisterMovieUseCase }
