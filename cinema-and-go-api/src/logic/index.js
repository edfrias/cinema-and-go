const bcrypt = require('bcrypt')
const { LogicError } = require('../common/errors')
const validate = require('../common/validate')
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
const {Types: {ObjectId}} = mongoose
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

const logic = {
    registerUser(name, email, password) {
        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true },
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])
        validate.email(email)

        return userUseCases.registerUser(name, email, password)
    },

    authenticateUser(email, password) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])
        validate.email(email)

        return userUseCases.authenticateUser(email, password)
    },

    retrieveUser(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return userUseCases.retrieveUser(id)
    },

    updateUser(id, data) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'data', value: data, type: 'object', notEmpty: true }
        ])

        return userUseCases.updateUser(id, data)
    },

    removeUser(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return userUseCases.removeUser(id)
    },

    // Temporary compatibility alias while routes are migrated.
    deleteUser(id) {
        return userUseCases.removeUser(id)
    },

    registerCities(name, link, cinemas) {
        return(async () => {
            return await City.create({name, link, cinemas})
        })()
    },

    registerMovie(title, img, info, cast) {
        return cinemaImportUseCases.registerMovie(title, img, info, cast)
    },

    registerSessions(movie, sessions) {
        return cinemaImportUseCases.registerSessions(movie, sessions)
    },

    registerCinema(name, link, phone, address, location, movieSessions, city) {
        return cinemaImportUseCases.registerCinema(name, link, phone, address, location, movieSessions, city)
    },

    scrapCinemaMovies() {
        return cinemaImportUseCases.scrapCinemaMovies()
    },

    retrieveAllCinemas() {
        return cinemaReadUseCases.retrieveAllCinemas()
    },

    retrieveCinema(id) {
        return cinemaReadUseCases.retrieveCinema(id)
    },

    retrieveAllCinemaSessions(id) {
        return cinemaReadUseCases.retrieveAllCinemaSessions(id)
    },

    retireveNearestCinemas(lng, lat, dist) {
        return cinemaReadUseCases.retrieveNearestCinemas(lng, lat, dist)
    },

    registerCinemaLocation(cinema, user, distance, duration) {
        return(async () => {
            await Distance.create({ distance, duration, cinema, user })
        })()
    },

    setCinemaLocation(defaultPos, cinemaLocation, MAPS_KEY) {
        debugger
        const mapsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${defaultPos}&destination=${cinemaLocation}&key=${MAPS_KEY}&mode=walking`

        return (async () => {
            debugger
            const cinema = {}

            const gMapsInfo = await gMaps.getData(mapsUrl)
            debugger

            cinema.duration = gMapsInfo.routes[0].legs[0].duration.value
            cinema.distance = gMapsInfo.routes[0].legs[0].distance.value

            return cinema
        })()
    },

    retrieveCinemaLocation(cinemaId, userId) {
        return(async () => {
            const cinemaData = await Distance.findOne({$and: [{user: new ObjectId(userId)}, {cinema: new ObjectId(cinemaId)}]})

            return cinemaData
        })()
    }

}

module.exports = logic
