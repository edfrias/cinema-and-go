const { RegisterUserUseCase } = require('./RegisterUserUseCase')
const { AuthenticateUserUseCase } = require('./AuthenticateUserUseCase')
const { RetrieveUserUseCase } = require('./RetrieveUserUseCase')
const { UpdateUserUseCase } = require('./UpdateUserUseCase')
const { RemoveUserUseCase } = require('./RemoveUserUseCase')

function createUserUseCases({ userRepository, bcrypt }) {
    return {
        registerUser: (name, email, password) => new RegisterUserUseCase({ userRepository, bcrypt }).execute(name, email, password),
        authenticateUser: (email, password) => new AuthenticateUserUseCase({ userRepository, bcrypt }).execute(email, password),
        retrieveUser: id => new RetrieveUserUseCase({ userRepository }).execute(id),
        updateUser: (id, data) => new UpdateUserUseCase({ userRepository }).execute(id, data),
        removeUser: id => new RemoveUserUseCase({ userRepository }).execute(id)
    }
}

module.exports = { createUserUseCases }
