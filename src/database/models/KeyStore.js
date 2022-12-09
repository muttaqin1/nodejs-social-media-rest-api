const { Schema, model } = require('mongoose')

const schema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        primaryKey: {
            type: String,
            required: true,
        },
        secondaryKey: {
            type: String,
            required: true,
        },
    },
    {
        versionKey: false,
    }
)

const KeyStore = new model('keystore', schema)

module.exports = KeyStore
