const bcrypt = require('bcrypt')
const { LogicError } = require('../common/errors')
const validate = require('../common/validate')
const models = require('cinema-and-go-data/src/models')
const scrapper = require('../lib/scrapper')
const gMaps = require('../lib/maps')

const { mongoose, User, Movie, MovieSessions, City, Cinema, Point, Distance } = models
const {Types: {ObjectId}} = mongoose

const logic = {
    registerUser(name, email, password) {
        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true },
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return (async () => {
            const user = await User.findOne({'email': email})
            if (user) throw new LogicError(`user with email "${email}" already exists`)

            let hash = await bcrypt.hash(password, 10)

            return await User.create({ name, email, password: hash })
        })()
    },

    authenticateUser(email, password) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        return (async () => {
            const user = await User.findOne({'email': email})
            if (!user) throw new LogicError(`user with email "${email}" does not exists`)

            if (await bcrypt.compare(password, user.password)) return user.id
            else throw new LogicError('wrong credentials')
        })()
    },

    retrieveUser(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const user = await User.findById(ObjectId(id)).select('-__v  -password').lean()
            if (!user) throw new LogicError(`user with id "${id}" does not exists`)

            return user
        })()
    },

    updateUser(id, data) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'data', value: data, type: 'object', notEmpty: true }
        ])

        return (async () => {
            try {
                let result = await User.findByIdAndUpdate(id, { $set: data }).select('-__v  -password').lean()

                result.id = result._id.toString()
                delete result._id

                return result

            } catch(error) {
                throw new LogicError(`user with id "${id}" does not exists`)
            }
        })()
    },

    removeUser(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        return (async () => {
            const user = await User.findById(id)
            if(!user) throw new LogicError(`user with id "${id}" does not exists`)

            return await User.findByIdAndDelete(id)
        })()
    },

    registerCities(name, link, cinemas) {
        return(async () => {
            return await City.create({name, link, cinemas})
        })()
    },

    registerMovie(title, img, info, cast) {
        return (async () => {
            const exists = await Movie.findOne({ title })
            if (exists) return exists._id

            const insertMovie = await Movie.create({ title, img, info, cast })

            return insertMovie._id
        })()
    },

    registerSessions(movie, sessions) {
        return(async () => {
            return await MovieSessions.create({ movie, sessions })
        })()
    },

    registerCinema(name, link, phone, address, location, movieSessions, city) {
        return (async () => {
            const exists = await Cinema.findOne({ name })
            if (exists) return exists._id

            const insertCinema = await Cinema.create({ name, link, phone, address, location: new Point({ coordinates: location }), movieSessions, city })

            return insertCinema._id
        })()
    },

    scrapCinemaMovies() {
        const bcnCinemas = 'https://www.ecartelera.com/cines/0,9,23.html'
        return (async () => {
            const scrapCinemas = await scrapper.getAllCinemas(bcnCinemas)
            //debugger
            await Promise.all(
                scrapCinemas.map(async ({ name, link, phone, address, location, billboard }) => {
                    const cinemaSessions = await Promise.all(
                        billboard.map(async ({title, img, info, cast, movieSessions}) => {
                            const movie = await this.registerMovie(title, img, info, cast)
                            debugger
                            return await this.registerSessions(ObjectId(movie), movieSessions)
                        })
                    )
                    //debugger
                    await this.registerCinema(name, link, phone, address, location, cinemaSessions)
                })
            )
        })()
    },

    retrieveAllCinemas() {
        return (async() => {
            return await Cinema.find()
            .select('-__v').lean()
            .populate({
                path: 'movieSessions',
                model: 'movieSessions',
                select: '-__v',
                options: { lean: true },
                populate: {
                    path: 'movie',
                    model: 'movie',
                    select: '-__v',
                    options: { lean: true }
                },
            })
        })()
    },

    retrieveCinema(id) {
        return (async() => {
            const cinema = await Cinema.find({ _id: id }).select('-__v').lean()

            return cinema[0]
        })()
    },

    retrieveAllCinemaSessions(id) {
        return (async() => {
            return await MovieSessions.find({ _id: id })
            .select('-__v')
            .populate({
                path: 'movie',
                model: 'movie',
                select: '-__v',
                options: { lean: true }
            })
        })()
    },

    retireveNearestCinemas(lng, lat, dist) {
        return (async () => {
            const cinemaLocations = await Cinema.find({ "location": {$near: { $geometry: { type: "Point", coordinates: [lng, lat] }, $maxDistance: dist }}}, 'location.coordinates').lean()

            return cinemaLocations
        })()
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
            const cinemaData = await Distance.findOne({$and: [{user: ObjectId(userId)}, {cinema: ObjectId(cinemaId)}]})

            return cinemaData
        })()
    }

}

module.exports = logic
