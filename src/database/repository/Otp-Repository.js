const BaseRepository = require('./Base-Repository')
const Otp = require('../models/Otp')
const {
    AppError: { ApiError },
} = require('../../helpers')
const { codeGenerator } = require('../../helpers')

class OtpRepository extends BaseRepository {
    constructor() {
        super(Otp, 'otp')
    }
    async CreateOtp(email) {
        const otp = codeGenerator(6)
        try {
            return await this.Create({ otp, user: email })
        } catch {
            throw new ApiError()
        }
    }
}

module.exports = OtpRepository
