class ScrapCinemaMoviesUseCase {
    constructor({ scrapperAdapter, registerMovie, registerSessions, registerCinema }) {
        this.scrapperAdapter = scrapperAdapter
        this.registerMovie = registerMovie
        this.registerSessions = registerSessions
        this.registerCinema = registerCinema
    }

    async execute(urlCity) {
        const scrapCinemas = await this.scrapperAdapter.getAllCinemas(urlCity)

        await Promise.all(
            scrapCinemas.map(async ({ name, link, phone, address, location, billboard }) => {
                const cinemaSessions = await Promise.all(
                    billboard.map(async ({ title, img, info, cast, movieSessions }) => {
                        const movie = await this.registerMovie(title, img, info, cast)

                        return this.registerSessions(movie, movieSessions)
                    })
                )

                await this.registerCinema(name, link, phone, address, location, cinemaSessions)
            })
        )
    }
}

module.exports = { ScrapCinemaMoviesUseCase }
