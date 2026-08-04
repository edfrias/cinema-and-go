const { Schema } = require('mongoose')

const point = new Schema({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (values) => Array.isArray(values)
          && values.length === 2
          && values.every((value) => typeof value === 'number' && Number.isFinite(value)),
        message: 'coordinates must contain exactly two numeric values',
      }
    }
}, {
  _id: false,
})

module.exports = point
