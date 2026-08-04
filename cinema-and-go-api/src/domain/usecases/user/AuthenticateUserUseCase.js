const validate = require('../../../common/validate')
const { LogicError } = require('../../../common/errors')

class AuthenticateUserUseCase {
    constructor({ userRepository, bcrypt }) {
        this.userRepository = userRepository
        this.bcrypt = bcrypt
    }

    async execute(email, password) {
        validate.arguments([
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new LogicError(`user with email "${email}" does not exists`)

        if (await this.bcrypt.compare(password, user.password)) return user.id

        throw new LogicError('wrong credentials')
    }
}

module.exports = { AuthenticateUserUseCase }
