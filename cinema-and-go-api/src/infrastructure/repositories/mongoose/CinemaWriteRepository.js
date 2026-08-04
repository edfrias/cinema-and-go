const ICinemaWriteRepository = require('../../../domain/interfaces/ICinemaWriteRepository')

class CinemaWriteRepository extends ICinemaWriteRepository {
    constructor({ CinemaModel, PointModel }) {
        super()
        this.CinemaModel = CinemaModel
        this.PointModel = PointModel
    }

    findByName(name) {
        return this.CinemaModel.findOne({ name })
    }

    createCinema({ name, link, phone, address, location, movieSessions, city }) {
        return this.CinemaModel.create({
            name,
            link,
            phone,
            address,
            location: new this.PointModel({ coordinates: location }),
            movieSessions,
            city
        })
    }
}

module.exports = { CinemaWriteRepository }
