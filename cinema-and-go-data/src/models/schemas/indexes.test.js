const test = require('node:test')
const assert = require('node:assert/strict')

const schemas = require('./index')

function hasIndex(schema, expectedKeys, optionsCheck) {
  return schema.indexes().some(([keys, options]) => {
    const sameKeys = JSON.stringify(keys) === JSON.stringify(expectedKeys)
    if (!sameKeys) {
      return false
    }

    if (!optionsCheck) {
      return true
    }

    return optionsCheck(options || {})
  })
}

test('user schema has unique email index and required normalized fields', () => {
  const { user } = schemas
  const namePath = user.path('name')
  const emailPath = user.path('email')
  const passwordPath = user.path('password')

  assert.equal(namePath.options.required, true)
  assert.equal(namePath.options.trim, true)
  assert.equal(emailPath.options.required, true)
  assert.equal(emailPath.options.trim, true)
  assert.equal(emailPath.options.lowercase, true)
  assert.equal(passwordPath.options.required, true)
  assert.equal(passwordPath.options.minlength, 6)

  assert.equal(
    hasIndex(user, { email: 1 }, (options) => options.unique === true),
    true
  )
})

test('cinema schema has location/name/phone indexes and expected refs', () => {
  const { cinema } = schemas

  assert.equal(hasIndex(cinema, { location: '2dsphere' }), true)
  assert.equal(hasIndex(cinema, { name: 1 }), true)
  assert.equal(hasIndex(cinema, { phone: 1 }), true)

  assert.equal(cinema.path('movieSessions').caster.options.ref, 'movieSessions')
  assert.equal(cinema.path('city').options.ref, 'city')
})

test('city schema has name index and cinema refs', () => {
  const { city } = schemas

  assert.equal(hasIndex(city, { name: 1 }), true)
  assert.equal(city.path('cinemas').caster.options.ref, 'cinema')
})

test('distance schema has validation and unique user/cinema index', () => {
  const { distance } = schemas

  assert.equal(distance.path('distance').options.required, true)
  assert.equal(distance.path('distance').options.min, 0)
  assert.equal(distance.path('duration').options.required, true)
  assert.equal(distance.path('duration').options.min, 0)
  assert.equal(distance.path('cinema').options.ref, 'cinema')
  assert.equal(distance.path('user').options.ref, 'user')
  assert.equal(
    hasIndex(
      distance,
      { user: 1, cinema: 1 },
      (options) => options.unique === true
    ),
    true
  )
})

test('movie schema has title index and defaults', () => {
  const { movie } = schemas

  assert.equal(hasIndex(movie, { title: 1 }), true)
  const infoDefault = movie.path('info').defaultValue
  assert.deepEqual(typeof infoDefault === 'function' ? infoDefault() : infoDefault, [])
  assert.equal(movie.path('cast').defaultValue, '')
})

test('movie sessions schema has required options, index, and timestamps', () => {
  const { movieSessions } = schemas

  assert.equal(movieSessions.path('movie').options.ref, 'movie')
  assert.equal(movieSessions.path('sessions').options.required, true)
  assert.equal(typeof movieSessions.path('sessions').options.validate.validator, 'function')
  assert.equal(hasIndex(movieSessions, { createdAt: -1 }), true)
  assert.equal(movieSessions.options.timestamps, true)
})

test('point schema has required Point type and strict coordinates validator', () => {
  const { point } = schemas

  assert.equal(point.options._id, false)
  assert.deepEqual(point.path('type').enumValues, ['Point'])

  const coordinateValidator = point.path('coordinates').options.validate.validator
  assert.equal(coordinateValidator([1, 2]), true)
  assert.equal(coordinateValidator([1]), false)
  assert.equal(coordinateValidator([1, '2']), false)
})
