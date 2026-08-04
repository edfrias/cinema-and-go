const IUserRepository = require('../../../domain/interfaces/IUserRepository')

class UserRepository extends IUserRepository {
    constructor(UserModel) {
        super()
        this.UserModel = UserModel
    }

    findByEmail(email) {
        return this.UserModel.findOne({ email })
    }

    createUser(data) {
        return this.UserModel.create(data)
    }

    getUserById(id) {
        return this.UserModel.findById(id).select('-__v  -password').lean()
    }

    getRawUserById(id) {
        return this.UserModel.findById(id)
    }

    updateUserById(id, data) {
        return this.UserModel.findByIdAndUpdate(id, { $set: data }).select('-__v  -password').lean()
    }

    deleteUserById(id) {
        return this.UserModel.findByIdAndDelete(id)
    }
}

module.exports = { UserRepository }
