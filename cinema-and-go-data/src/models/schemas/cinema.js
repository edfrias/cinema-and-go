const { Schema, ObjectId } = require('mongoose')
const point = require('./point')

const cinema = new Schema({
  name: { type: String, required: true, trim: true },
  link: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  location: {
    type: point,
    required: true
  },
  movieSessions: [{
    type: ObjectId,
    ref: 'movieSessions',
    required: true
  }],
  city: { type: ObjectId, ref: 'city' },
})

cinema.index({ location: '2dsphere' })
cinema.index({ name: 1 })
cinema.index({ phone: 1 })

module.exports = cinema
