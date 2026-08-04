const dotenv = require('dotenv')
const { mongoose } = require('cinema-and-go-data/src/models')
const { apiService } = require('../composition/apiService')
const { runPopulate } = require('./runPopulate')

dotenv.config()

const { env: { MONGO_URL_LOCAL: url } } = process;

(async () => {
    await runPopulate({ mongoose, url, apiService, logger: console })
})()
