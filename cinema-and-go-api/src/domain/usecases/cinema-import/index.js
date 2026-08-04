const { RegisterMovieUseCase } = require('./RegisterMovieUseCase')
const { RegisterSessionsUseCase } = require('./RegisterSessionsUseCase')
const { RegisterCinemaUseCase } = require('./RegisterCinemaUseCase')
const { ScrapCinemaMoviesUseCase } = require('./ScrapCinemaMoviesUseCase')

function createCinemaImportUseCases({ movieRepository, movieSessionsRepository, cinemaWriteRepository, scrapperAdapter }) {
    const registerMovieUseCase = new RegisterMovieUseCase({ movieRepository })
    const registerSessionsUseCase = new RegisterSessionsUseCase({ movieSessionsRepository })
    const registerCinemaUseCase = new RegisterCinemaUseCase({ cinemaWriteRepository })

    return {
        registerMovie: (title, img, info, cast) => registerMovieUseCase.execute(title, img, info, cast),
        registerSessions: (movie, sessions) => registerSessionsUseCase.execute(movie, sessions),
        registerCinema: (name, link, phone, address, location, movieSessions, city) =>
            registerCinemaUseCase.execute(name, link, phone, address, location, movieSessions, city),
        scrapCinemaMovies: (urlCity = 'https://www.ecartelera.com/cines/0,9,23.html') =>
            new ScrapCinemaMoviesUseCase({
                scrapperAdapter,
                registerMovie: (title, img, info, cast) => registerMovieUseCase.execute(title, img, info, cast),
                registerSessions: (movie, sessions) => registerSessionsUseCase.execute(movie, sessions),
                registerCinema: (name, link, phone, address, location, movieSessions) =>
                    registerCinemaUseCase.execute(name, link, phone, address, location, movieSessions)
            }).execute(urlCity)
    }
}

module.exports = { createCinemaImportUseCases }
