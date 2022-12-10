const { Schema, model } = require('mongoose');

const profileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        avatar: {
            public_id: String,
            url: String,
        },

        nickname: String,
        bio: {
            type: String,
        },
        address: {
            country: String,
            city: String,
            zipcode: String,
            homeAddress: String,
        },
        occupation: String,
        worksAt: String,
        joined: {
            type: Date,
            default: Date.now,
        },
        hobbies: {
            type: Array,
        },
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        friendRequests: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        sendedFriendRequests: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        following: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        posts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Post',
                required: true,
            },
        ],
        createdAt: {
            type: Date,
            default: Date.new,
            select: false,
        },
        updatedAt: {
            type: Date,
            default: Date.new,
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const Profile = new model('Profile', profileSchema);

module.exports = Profile;
