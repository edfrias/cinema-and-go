const validate = require('../../../common/validate')
const { LogicError } = require('../../../common/errors')

class UpdateUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository
    }

    async execute(id, data) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true },
            { name: 'data', value: data, type: 'object', notEmpty: true }
        ])

        try {
            const result = await this.userRepository.updateUserById(id, data)

            result.id = result._id.toString()
            delete result._id

            return result
        } catch (error) {
            throw new LogicError(`user with id "${id}" does not exists`)
        }
    }
}

module.exports = { UpdateUserUseCase }
