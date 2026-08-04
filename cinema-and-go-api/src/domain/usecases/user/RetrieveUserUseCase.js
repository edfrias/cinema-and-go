const models = require('cinema-and-go-data/src/models')
const validate = require('../../../common/validate')
const { LogicError } = require('../../../common/errors')

const { mongoose } = models
const { Types: { ObjectId } } = mongoose

class RetrieveUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository
    }

    async execute(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        const user = await this.userRepository.getUserById(new ObjectId(id))
        if (!user) throw new LogicError(`user with id "${id}" does not exists`)

        return user
    }
}

module.exports = { RetrieveUserUseCase }
