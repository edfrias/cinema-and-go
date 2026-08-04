const { Schema, ObjectId } = require('mongoose')

const city = new Schema({
    name: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    cinemas: [{ type: ObjectId, ref: 'cinema'}]
})

city.index({ name: 1 })

module.exports = city
