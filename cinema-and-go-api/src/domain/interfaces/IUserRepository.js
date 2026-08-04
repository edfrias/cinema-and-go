class IUserRepository {
    async findByEmail(email) {
        throw new Error('Not implemented')
    }

    async createUser(data) {
        throw new Error('Not implemented')
    }

    async getUserById(id) {
        throw new Error('Not implemented')
    }

    async getRawUserById(id) {
        throw new Error('Not implemented')
    }

    async updateUserById(id, data) {
        throw new Error('Not implemented')
    }

    async deleteUserById(id) {
        throw new Error('Not implemented')
    }
}

module.exports = IUserRepository
