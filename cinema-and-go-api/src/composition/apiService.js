const bcrypt = require('bcrypt')
const models = require('cinema-and-go-data/src/models')
const scrapper = require('../lib/scrapper')
const gMaps = require('../lib/maps')
const { createUserUseCases } = require('../domain/usecases/user')
const { createCinemaReadUseCases } = require('../domain/usecases/cinema')
const { createCinemaImportUseCases } = require('../domain/usecases/cinema-import')
const { UserRepository } = require('../infrastructure/repositories/mongoose/UserRepository')
const { CinemaQueryRepository } = require('../infrastructure/repositories/mongoose/CinemaQueryRepository')
const { MovieRepository } = require('../infrastructure/repositories/mongoose/MovieRepository')
const { MovieSessionsRepository } = require('../infrastructure/repositories/mongoose/MovieSessionsRepository')
const { CinemaWriteRepository } = require('../infrastructure/repositories/mongoose/CinemaWriteRepository')
const { ScrapperAdapter } = require('../infrastructure/adapters/ScrapperAdapter')

const { mongoose, User, Movie, MovieSessions, City, Cinema, Point, Distance } = models
const { Types: { ObjectId } } = mongoose

function createApiService() {
    const userUseCases = createUserUseCases({ userRepository: new UserRepository(User), bcrypt })
    const cinemaReadUseCases = createCinemaReadUseCases({
        cinemaQueryRepository: new CinemaQueryRepository({ CinemaModel: Cinema, MovieSessionsModel: MovieSessions })
    })
    const cinemaImportUseCases = createCinemaImportUseCases({
        movieRepository: new MovieRepository(Movie),
        movieSessionsRepository: new MovieSessionsRepository(MovieSessions),
        cinemaWriteRepository: new CinemaWriteRepository({ CinemaModel: Cinema, PointModel: Point }),
        scrapperAdapter: new ScrapperAdapter(scrapper)
    })

    return {
        registerUser: (name, email, password) => userUseCases.registerUser(name, email, password),
        authenticateUser: (email, password) => userUseCases.authenticateUser(email, password),
        retrieveUser: id => userUseCases.retrieveUser(id),
        updateUser: (id, data) => userUseCases.updateUser(id, data),
        removeUser: id => userUseCases.removeUser(id),
        registerCities: (name, link, cinemas) => City.create({ name, link, cinemas }),
        registerMovie: (title, img, info, cast) => cinemaImportUseCases.registerMovie(title, img, info, cast),
        registerSessions: (movie, sessions) => cinemaImportUseCases.registerSessions(movie, sessions),
        registerCinema: (name, link, phone, address, location, movieSessions, city) =>
            cinemaImportUseCases.registerCinema(name, link, phone, address, location, movieSessions, city),
        scrapCinemaMovies: () => cinemaImportUseCases.scrapCinemaMovies(),
        retrieveAllCinemas: () => cinemaReadUseCases.retrieveAllCinemas(),
        retrieveCinema: id => cinemaReadUseCases.retrieveCinema(id),
        retrieveAllCinemaSessions: id => cinemaReadUseCases.retrieveAllCinemaSessions(id),
        retrieveNearestCinemas: (lng, lat, dist) => cinemaReadUseCases.retrieveNearestCinemas(lng, lat, dist),
        registerCinemaLocation: (cinema, user, distance, duration) => Distance.create({ distance, duration, cinema, user }),
        async setCinemaLocation(defaultPos, cinemaLocation, mapsKey) {
            const mapsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${defaultPos}&destination=${cinemaLocation}&key=${mapsKey}&mode=walking`
            const gMapsInfo = await gMaps.getData(mapsUrl)

            return {
                duration: gMapsInfo.routes[0].legs[0].duration.value,
                distance: gMapsInfo.routes[0].legs[0].distance.value
            }
        },
        retrieveCinemaLocation: (cinemaId, userId) =>
            Distance.findOne({ $and: [{ user: new ObjectId(userId) }, { cinema: new ObjectId(cinemaId) }] })
    }
}

const apiService = createApiService()

module.exports = { createApiService, apiService }