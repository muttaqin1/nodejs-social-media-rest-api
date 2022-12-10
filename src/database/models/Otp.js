const { Schema, model } = require('mongoose')

const otpSchema = new Schema({
    otp: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
    },
    user: {
        type: String,
        required: true,
        trim: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '10m',
    },
})

const Otp = new model('otp', otpSchema)
module.exports = Otp
