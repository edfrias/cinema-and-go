require('dotenv').config()

const package = require('./package.json')
const { createApp } = require('./src/app')
const { mongoose } = require('cinema-and-go-data')

// PRE
// const { env: { PORT, MONGO_URL_LOCAL: url }, argv: [, , port = PORT || 8080], } = process;
const { env: { PORT, MONGO_URL: url }, argv: [, , port = PORT || 8080], } = process;

(async () => {
    try {
        await mongoose.connect(url)

        console.log(`connected to ${url} database`)

        const app = createApp()

        app.listen(port, () => console.log(`${package.name} ${package.version} up on port ${port}`))
    } catch (error) {
        console.log(error.name, error.message)
    }
})()


process.on('SIGINT', async () => {
    await mongoose.disconnect()

    console.log('Session terminated.')
    process.exit(0)
})
