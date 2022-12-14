const { Schema, model } = require('mongoose');

const storySchema = new Schema(
    {
        creator: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        image: {
            secureUrl: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
        privicy: {
            type: String,
            default: 'friends',
            enum: ['public', 'friends'],
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        dislikes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        message: {
            type: String,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: '24h',
            select: false,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
            select: false,
        },
    },
    { versionKey: false }
);

const Story = new model('Storie', storySchema);

module.exports = Story;
