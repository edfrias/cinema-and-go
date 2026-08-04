const { Schema, ObjectId } = require('mongoose')

const movieSessions = new Schema({
  movie: { type: ObjectId, ref: 'movie', required: true },
  sessions: {
    type: [String],
    required: true,
    validate: {
      validator: (values) => Array.isArray(values)
        && values.length > 0
        && values.every((value) => typeof value === 'string' && value.trim().length > 0),
      message: 'sessions must be a non-empty array of strings',
    },
  }
}, {
  timestamps: true,
})

movieSessions.index({ createdAt: -1 })

module.exports = movieSessions
