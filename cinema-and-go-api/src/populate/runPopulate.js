async function runPopulate({ mongoose, url, apiService, logger = console }) {
    try {
        await mongoose.connect(url)

        logger.log('connected to database')

        await apiService.scrapCinemaMovies()
    } catch (error) {
        logger.error(error, error.message)
        throw error
    } finally {
        await mongoose.disconnect()
    }
}

module.exports = { runPopulate }