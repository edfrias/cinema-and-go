const { Schema, ObjectId } = require('mongoose')

const user = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  distance: {
    type: ObjectId,
    ref: 'distance',
  },
})

module.exports = user
