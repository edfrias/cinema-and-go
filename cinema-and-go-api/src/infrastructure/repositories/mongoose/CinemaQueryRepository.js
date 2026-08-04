const ICinemaQueryRepository = require('../../../domain/interfaces/ICinemaQueryRepository')

class CinemaQueryRepository extends ICinemaQueryRepository {
    constructor({ CinemaModel, MovieSessionsModel }) {
        super()
        this.CinemaModel = CinemaModel
        this.MovieSessionsModel = MovieSessionsModel
    }

    getAllCinemas() {
        return this.CinemaModel.find()
            .select('-__v')
            .lean()
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
                }
            })
    }

    async getCinemaById(id) {
        const cinema = await this.CinemaModel.find({ _id: id }).select('-__v').lean()

        return cinema[0]
    }

    getCinemaSessionsById(id) {
        return this.MovieSessionsModel.find({ _id: id })
            .select('-__v')
            .populate({
                path: 'movie',
                model: 'movie',
                select: '-__v',
                options: { lean: true }
            })
    }

    getNearestCinemas(lng, lat, dist) {
        return this.CinemaModel.find(
            {
                location: {
                    $near: {
                        $geometry: { type: 'Point', coordinates: [lng, lat] },
                        $maxDistance: dist
                    }
                }
            },
            'location.coordinates'
        ).lean()
    }
}

module.exports = { CinemaQueryRepository }
