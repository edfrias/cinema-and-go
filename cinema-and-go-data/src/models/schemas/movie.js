const { Schema } = require('mongoose')

const movie = new Schema({
        title: { type: String, required: true, trim: true },
        img: { type: String, required: true, trim: true },
        info: {
            type: [String],
            default: [],
        },
        cast: {
            type: String,
            trim: true,
            default: '',
        }
})

movie.index({ title: 1 })

module.exports = movie
