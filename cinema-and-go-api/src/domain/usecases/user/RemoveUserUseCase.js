const validate = require('../../../common/validate')
const { LogicError } = require('../../../common/errors')

class RemoveUserUseCase {
    constructor({ userRepository }) {
        this.userRepository = userRepository
    }

    async execute(id) {
        validate.arguments([
            { name: 'id', value: id, type: 'string', notEmpty: true }
        ])

        const user = await this.userRepository.getRawUserById(id)
        if (!user) throw new LogicError(`user with id "${id}" does not exists`)

        return this.userRepository.deleteUserById(id)
    }
}

module.exports = { RemoveUserUseCase }
