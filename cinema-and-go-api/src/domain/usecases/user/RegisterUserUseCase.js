const validate = require('../../../common/validate')
const { LogicError } = require('../../../common/errors')

class RegisterUserUseCase {
    constructor({ userRepository, bcrypt }) {
        this.userRepository = userRepository
        this.bcrypt = bcrypt
    }

    async execute(name, email, password) {
        validate.arguments([
            { name: 'name', value: name, type: 'string', notEmpty: true },
            { name: 'email', value: email, type: 'string', notEmpty: true },
            { name: 'password', value: password, type: 'string', notEmpty: true }
        ])

        validate.email(email)

        const user = await this.userRepository.findByEmail(email)
        if (user) throw new LogicError(`user with email "${email}" already exists`)

        const hash = await this.bcrypt.hash(password, 10)

        return this.userRepository.createUser({ name, email, password: hash })
    }
}

module.exports = { RegisterUserUseCase }
