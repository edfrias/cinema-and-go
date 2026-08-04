class RegisterCinemaUseCase {
    constructor({ cinemaWriteRepository }) {
        this.cinemaWriteRepository = cinemaWriteRepository
    }

    async execute(name, link, phone, address, location, movieSessions, city) {
        const exists = await this.cinemaWriteRepository.findByName(name)
        if (exists) return exists._id

        const insertedCinema = await this.cinemaWriteRepository.createCinema({
            name,
            link,
            phone,
            address,
            location,
            movieSessions,
            city
        })

        return insertedCinema._id
    }
}

module.exports = { RegisterCinemaUseCase }
