const { Schema, ObjectId } = require('mongoose')

const distance = new Schema({
    distance: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 0 },
    cinema: { type: ObjectId, ref: 'cinema', required: true },
    user : { type: ObjectId, ref: 'user', required: true }
})

distance.index({ user: 1, cinema: 1 }, { unique: true })

module.exports = distance
