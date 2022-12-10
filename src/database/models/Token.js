const { Schema, model } = require('mongoose')

const TokenSchema = new Schema(
    {
        userId: { type: String, required: true, ref: 'User' },
        token: { type: String, required: true },

        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            expires: '30m',
        },
    },
    { timestamps: true, versionKey: false }
)

const Token = new model('token', TokenSchema)

module.exports = Token
