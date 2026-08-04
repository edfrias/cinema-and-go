const express = require('express')
const cors = require('cors')
const routes = require('./routes')

function createApp() {
    const app = express()

    app.use(cors())
    app.use('/api', routes)
    app.use((req, res) => {
        res.status(404).json({ error: 'Not found.' })
    })

    return app
}

module.exports = { createApp }