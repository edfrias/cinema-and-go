const { RetrieveAllCinemasUseCase } = require('./RetrieveAllCinemasUseCase')
const { RetrieveCinemaUseCase } = require('./RetrieveCinemaUseCase')
const { RetrieveAllCinemaSessionsUseCase } = require('./RetrieveAllCinemaSessionsUseCase')
const { RetrieveNearestCinemasUseCase } = require('./RetrieveNearestCinemasUseCase')

function createCinemaReadUseCases({ cinemaQueryRepository }) {
    return {
        retrieveAllCinemas: () => new RetrieveAllCinemasUseCase({ cinemaQueryRepository }).execute(),
        retrieveCinema: cinemaId => new RetrieveCinemaUseCase({ cinemaQueryRepository }).execute(cinemaId),
        retrieveAllCinemaSessions: sessionId => new RetrieveAllCinemaSessionsUseCase({ cinemaQueryRepository }).execute(sessionId),
        retrieveNearestCinemas: (lng, lat, dist) => new RetrieveNearestCinemasUseCase({ cinemaQueryRepository }).execute(lng, lat, dist)
    }
}

module.exports = { createCinemaReadUseCases }
