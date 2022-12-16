const BaseRepository = require('./Base-Repository');
const Comment = require('../models/Comment');
const {
    AppError: { ApiError },
} = require('../../helpers');

class CommentRepository extends BaseRepository {
    constructor() {
        super(Comment, 'Comment');
    }

    async Like(comment, userId, commentId) {
        try {
            if (comment?.dislikes?.includes(userId)) {
                await this.PullData(
                    {
                        _id: commentId,
                    },
                    {
                        dislikes: userId,
                    }
                );
            } else if (comment?.likes?.includes(userId)) {
                await this.PullData(
                    {
                        _id: commentId,
                    },
                    {
                        likes: userId,
                    }
                );
                return false;
            }
            await this.PushData(
                {
                    _id: commentId,
                },
                {
                    likes: userId,
                }
            );
            return true;
        } catch {
            throw new ApiError(`Failed to like ${this.name}`);
        }
    }
    async Dislike(comment, userId, commentId) {
        try {
            if (comment?.likes?.includes(userId)) {
                await this.PullData(
                    {
                        _id: commentId,
                    },
                    {
                        likes: user,
                    }
                );
            } else if (comment?.dislikes?.includes(userId)) {
                await this.PullData(
                    {
                        _id: commentId,
                    },
                    {
                        dislikes: user,
                    }
                );
                return false;
            }

            await this.PushData(
                {
                    _id: commentId,
                },
                {
                    dislikes: user,
                }
            );
            return;
        } catch {
            throw new ApiError(`Failded to dislike ${this.name}`);
        }
    }
}

module.exports = CommentRepository;
