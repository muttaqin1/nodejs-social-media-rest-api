const crypto = require('crypto');
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        verified: { type: Boolean, default: false },
        avatar: {
            public_id: String,
            url: String,
        },

        password: {
            type: String,
            select: false,
            trim: true,
            required: true,
        },
        salt: {
            type: String,
            required: true,
            trim: true,
            select: false,
        },
        roles: [{ type: Number, required: true }],
        birthday: {
            type: String,
            required: true,
        },

        gender: {
            type: String,
            enum: ['male', 'female', 'custom'],
            default: 'male',
            required: true,
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile',
        },
        createdAt: {
            type: Date,
            default: Date.now,
            select: false,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            select: false,
        },
    },
    {
        versionKey: false,
    }
);

const User = new model('User', userSchema);

module.exports = User;
