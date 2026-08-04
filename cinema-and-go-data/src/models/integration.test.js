const test = require('node:test')
const assert = require('node:assert/strict')
const { MongoMemoryServer } = require('mongodb-memory-server')
const models = require('./index')

const {
  mongoose,
  User,
  Cinema,
  Distance,
  Movie,
  MovieSessions,
  Point,
} = models

let mongod

async function connect() {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()

  await mongoose.connect(uri)
}

async function disconnect() {
  await mongoose.disconnect()

  if (mongod) {
    await mongod.stop()
  }
}

async function clearCollections() {
  const collections = mongoose.connection.collections
  const clearTasks = Object.values(collections).map((collection) => collection.deleteMany({}))
  await Promise.all(clearTasks)
}

test.before(async () => {
  await connect()
  await Promise.all([
    User.init(),
    Cinema.init(),
    Distance.init(),
    Movie.init(),
    MovieSessions.init(),
  ])
})

test.after(async () => {
  await disconnect()
})

test.beforeEach(async () => {
  await clearCollections()
})

test('enforces unique user email index', async () => {
  await User.create({
    name: 'Test User',
    email: 'user@example.com',
    password: 'secret123',
  })

  await assert.rejects(
    User.create({
      name: 'Other User',
      email: 'user@example.com',
      password: 'secret123',
    }),
    (error) => error && error.code === 11000
  )
})

test('enforces unique user+cinema in distance collection', async () => {
  const cinema = await Cinema.create({
    name: 'Cinema One',
    link: 'https://example.com/cinema-one',
    phone: '111111111',
    address: 'Main street',
    location: new Point({ coordinates: [2.13, 41.40] }),
    movieSessions: [],
  })

  const user = await User.create({
    name: 'Distance User',
    email: 'distance@example.com',
    password: 'secret123',
  })

  await Distance.create({
    distance: 100,
    duration: 200,
    cinema: cinema._id,
    user: user._id,
  })

  await assert.rejects(
    Distance.create({
      distance: 120,
      duration: 220,
      cinema: cinema._id,
      user: user._id,
    }),
    (error) => error && error.code === 11000
  )
})

test('supports geospatial near query on cinema location', async () => {
  await Cinema.create({
    name: 'Near Cinema',
    link: 'https://example.com/near-cinema',
    phone: '222222222',
    address: 'Near street',
    location: new Point({ coordinates: [2.1386, 41.4072] }),
    movieSessions: [],
  })

  const cinemas = await Cinema.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [2.1386, 41.4072],
        },
        $maxDistance: 500,
      },
    },
  })

  assert.equal(cinemas.length, 1)
  assert.equal(cinemas[0].name, 'Near Cinema')
})

test('adds createdAt when creating movie sessions', async () => {
  const movie = await Movie.create({
    title: 'Movie title',
    img: 'https://example.com/poster.jpg',
  })

  const session = await MovieSessions.create({
    movie: movie._id,
    sessions: ['18:00'],
  })

  assert.ok(session.createdAt instanceof Date)
})
