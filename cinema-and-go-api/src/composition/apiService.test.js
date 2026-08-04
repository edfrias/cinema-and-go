const dotenv = require('dotenv')
const { MongoMemoryServer } = require('mongodb-memory-server')
const { mongoose, User, Movie, MovieSessions, Cinema, Distance } = require('cinema-and-go-data/src/models')
const { Types: { ObjectId } } = mongoose
const bcrypt = require('bcrypt')
const { apiService } = require('./apiService')
const scrapper = require('../lib/scrapper')
const gMaps = require('../lib/maps')
const { RequirementError, ValueError, FormatError, LogicError } = require('../common/errors')

dotenv.config()

const { env: { MONGO_URL: url } } = process
const useRemoteTestDb = process.env.USE_REMOTE_TEST_DB === 'true'

const TEST_TIMEOUT = 1000000

describe('apiService', () => {
    let mongoServer

    beforeEach(() => {
        vi.restoreAllMocks()
    })

    beforeAll(async () => {
        try {
            if (useRemoteTestDb && url) {
                await mongoose.connect(url)
            } else {
                mongoServer = await MongoMemoryServer.create()
                await mongoose.connect(mongoServer.getUri())
            }

            console.log('connected to database')
        } catch (error) {
            console.log(error, error.message)
            throw error
        }
    }, TEST_TIMEOUT)

    let name, email, password

    beforeEach(async () => {
        await User.deleteMany()
        await Movie.deleteMany()
        await MovieSessions.deleteMany()
        await Cinema.deleteMany()
        await Distance.deleteMany()

        name = `name-${Math.random()}`
        email = `email-${Math.random()}@mail.com`
        password = `password-${Math.random()}`
    })

    describe('register user', () => {
        it('should succeed on correct data', async () => {
            const res = await apiService.registerUser(name, email, password)
            expect(res).toBeDefined()

            const users = await User.find()

            expect(users).toBeDefined()
            expect(users).toHaveLength(1)

            const [user] = users
            expect(user.name).toEqual(name)
            expect(user.email).toEqual(email)

            expect(user.password).toBeDefined()
            expect(await bcrypt.compare(password, user.password)).toBeTruthy()
        })

        it('should fail on undefined username', async () => {
            const name = undefined

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(RequirementError)
        })

        it('should fail on null username', async () => {
            const name = null

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(RequirementError)
        })

        it('should fail on empty username', async () => {
            const name = ''

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(ValueError)
        })

        it('should fail on blank username', async () => {
            const name = ' \t    \n'

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(ValueError)
        })

        it('should fail on undefined email', async () => {
            const email = undefined

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(RequirementError)
        })

        it('should fail on null email', async () => {
            const email = null

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(RequirementError)
        })

        it('should fail on empty email', async () => {
            const email = ''

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(ValueError)
        })

        it('should fail on blank email', async () => {
            const email = ' \t    \n'

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(ValueError)
        })

        it('should fail on non-email email', async () => {
            const nonEmail = 'non-email'

            await expect(apiService.registerUser(name, nonEmail, password)).rejects.toThrow(FormatError)
        })

        it('should fail on undefined username', async () => {
            const password = undefined

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(RequirementError)
        })

        it('should fail on null username', async () => {
            const password = null

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(RequirementError)
        })

        it('should fail on empty username', async () => {
            const password = ''

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(ValueError)
        })

        it('should fail on blank username', async () => {
            const password = ' \t    \n'

            await expect(apiService.registerUser(name, email, password)).rejects.toThrow(ValueError)
        })
    })

    describe('authenticate user', () => {
        let user

        beforeEach(async () => user = await User.create({ name, email, password: await bcrypt.hash(password, 10) }))

        it('should succeed on correct credentials', async () => {
            const id = await apiService.authenticateUser(email, password)

            expect(id).toBeDefined()
            expect(typeof id).toBe('string')

            expect(id).toEqual(user.id)
        })
    })

    describe('retrieve user', () => {
        let user

        beforeEach(async () => user = await User.create({ name, email, password: await bcrypt.hash(password, 10) }))

        it('should succeed on correct id from existing user', async () => {
            const _user = await apiService.retrieveUser(user.id)

            expect(_user.id).toBeUndefined()
            expect(_user.name).toEqual(name)
            expect(_user.email).toEqual(email)

            expect(_user.password).toBeUndefined()
        })
    })

    describe('update user', () => {
        let user, _name, _email, userUpdated, id

        beforeEach(async () => {
            user = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
            id = user.id
            _name = user.name + '_updated'
            _email = user.email + '_updated'
            userUpdated = { name: _name, email: _email }
        })

        it('should succeed on update user', async () => {
            await apiService.updateUser(id, userUpdated)

            const userChange = await apiService.retrieveUser(id)

            expect(userChange.name).toEqual(_name)
            expect(userChange.email).toEqual(_email)
            expect(userChange.password).toBeUndefined()
        })

        it('should fail on update user with incorrect user id', async () => {
            const id = 'aslkfjhsdlkafhjldksjhf'

            try {
                await apiService.updateUser(id, userUpdated)
                throw Error('should not reach this point')
            } catch (error) {
                expect(error).toBeInstanceOf(LogicError)
                expect(error.message).toEqual(`user with id "${id}" does not exists`)
            }
        })

        it('should fail on undefined id', async () => {
            await expect(apiService.updateUser(undefined, userUpdated)).rejects.toThrow(RequirementError)
        })

        it('should fail on null id', async () => {
            await expect(apiService.updateUser(null, userUpdated)).rejects.toThrow(RequirementError)
        })

        it('should fail on empty id', async () => {
            await expect(apiService.updateUser('', userUpdated)).rejects.toThrow(ValueError)
        })

        it('should fail on blank id', async () => {
            await expect(apiService.updateUser(' \t    \n', userUpdated)).rejects.toThrow(ValueError)
        })

        it('should fail on a not string id', async () => {
            await expect(apiService.updateUser(123, userUpdated)).rejects.toThrow(TypeError)
        })

        it('should fail on undefined user data', async () => {
            await expect(apiService.updateUser(id, undefined)).rejects.toThrow(RequirementError)
        })

        it('should fail on null user data', async () => {
            await expect(apiService.updateUser(id, null)).rejects.toThrow(RequirementError)
        })

        it('should fail on a not object data', async () => {
            await expect(apiService.updateUser(id, 'data')).rejects.toThrow(TypeError)
        })
    })

    describe('remove user', () => {
        let user, id

        beforeEach(async () => {
            user = await User.create({ name, email, password: await bcrypt.hash(password, 10) })
            id = user.id
        })

        it('should succeed on remove a user', async () => {
            await apiService.removeUser(id, password)

            await expect(apiService.retrieveUser(id)).rejects.toThrow(LogicError)
        })

        it('should fail on delete user with incorrect user id', async () => {
            const id_ = 'aslkfjhsd3141234dksjhf'

            try {
                await apiService.removeUser(id_, password)
                throw Error('should not reach this point')
            } catch (error) {
                expect(error.message).toContain('Cast to ObjectId failed for value')
                // expect(error.message).toEqual(`user with id \"aslkfjhsd3141234dksjhf\" does not exists`)
            }
        })

        it('should fail on undefined id', async () => {
            await expect(apiService.removeUser(undefined, password)).rejects.toThrow(RequirementError)
        })

        it('should fail on null id', async () => {
            await expect(apiService.removeUser(null, password)).rejects.toThrow(RequirementError)
        })

        it('should fail on empty id', async () => {
            await expect(apiService.removeUser('', password)).rejects.toThrow(ValueError)
        })

        it('should fail on blank id', async () => {
            await expect(apiService.removeUser(' \t    \n', password)).rejects.toThrow(ValueError)
        })
    })

    describe('register a city', () => {
        it('should register a new city into db', async () => {
            const name = 'Barcelona'
            const link = 'https://www.ecartelera.com/cines/0,9,23.html'
            const cinemas = []

            const inserted = await apiService.registerCities(name, link, cinemas)

            expect(inserted).toBeDefined()
        })
    })

    describe('scrap a movie', () => {
        it('should insert a movie into de database', async () => {
            const img = 'https://www.ecartelera.com/carteles/15000/15032/002-th.jpg'
            const title = 'El Hijo'
            const info = [ '90 min.', 'EE.UU.', 'Ciencia ficción', '+16' ]
            const cast = 'Elizabeth Banks, Jackson A. Dunn, David Denman Dir. David Yarovesky'

            const inserted = await apiService.registerMovie(title, img, info, cast)

            expect(inserted).toBeDefined()
        })
    })

    describe('get movie sessions', () => {
        let inserted

        beforeEach(async () => {
            const img = 'https://www.ecartelera.com/carteles/15000/15032/002-th.jpg'
            const title = 'El Hijo'
            const info = [ '90 min.', 'EE.UU.', 'Ciencia ficción', '+16' ]
            const cast = 'Elizabeth Banks, Jackson A. Dunn, David Denman Dir. David Yarovesky'
            inserted = await apiService.registerMovie(title, img, info, cast)
        })

        it('should insert all movie sessions from a given cinema', async () => {
            const movieSession = ['12:00', '16:30', '19:15', '22:00', '12:00', '20:00', '12:30', '17:15', '20:00', '18:00', '20:45' ]
            const sessions = await apiService.registerSessions(inserted, movieSession)
            expect(sessions).toBeDefined()
        })
    })

    describe('Scrap an entire city', () => {
        it('should get all cinemas from a given city', async () => {
            vi.spyOn(scrapper, 'getAllCinemas').mockResolvedValueOnce([
                {
                    name: 'Cinema Mock',
                    link: 'https://www.ecartelera.com/cines/cinema-mock/',
                    phone: '934000000',
                    address: 'Calle Mock 1',
                    location: [41.401, 2.17],
                    billboard: []
                }
            ])

            const cityCinemas = await apiService.scrapCinemaMovies()
            expect(cityCinemas).toBeUndefined()
        })
    })

    describe('retrieve all cinemas', () => {
        it('should retrieve a list of cinemas from db', async () => {
            const cinemas = await apiService.retrieveAllCinemas()

            expect(cinemas).toBeDefined()
        })
    })

    describe('register cinema distance and duration of the trip', () => {
        it('should register distance and duration values for a given cinema', async () => {
            const cinema = [1700, 1260]
            const cinemaId = new ObjectId()
            const userId = new ObjectId()

            const cinemaInfo = await apiService.registerCinemaLocation(cinemaId, userId, cinema[0], cinema[1])
            expect(cinemaInfo).toBeDefined()

            const retrieved = await apiService.retrieveCinemaLocation(cinemaId.toString(), userId.toString())
            expect(retrieved).toBeDefined()
            expect(retrieved.distance).toBe(cinema[0])
            expect(retrieved.duration).toBe(cinema[1])
        })

        it('should fetch information from google maps and then register that data', async () => {
            const origin = '41.4161666,2.1893583999999997'
            const destination = '41.4048732,2.1925995'
            const MAPS_KEY = 'AIzaSyDUJnlk-inpNkXenyzldRXMGWOAPjZR2S4'

            vi.spyOn(gMaps, 'getData').mockResolvedValueOnce({
                routes: [
                    {
                        legs: [
                            {
                                duration: { value: 1260 },
                                distance: { value: 1700 }
                            }
                        ]
                    }
                ]
            })

            const insertData = await apiService.setCinemaLocation(origin, destination, MAPS_KEY)

            expect(insertData).toBeDefined()
            expect(insertData.distance).toBe(1700)
            expect(insertData.duration).toBe(1260)
        })

        it('should retrieve the correct distance and trip duration for a given data', async () => {
            const cinemaId = new ObjectId()
            const userId = new ObjectId()

            await apiService.registerCinemaLocation(cinemaId, userId, 1000, 800)

            const cinemaData = await apiService.retrieveCinemaLocation(cinemaId.toString(), userId.toString())
            expect(cinemaData).toBeDefined()
            expect(cinemaData.distance).toBe(1000)
            expect(cinemaData.duration).toBe(800)
        })
    })

    afterAll(async () => {
        await mongoose.disconnect()

        if (mongoServer) {
            await mongoServer.stop()
        }
    })
})