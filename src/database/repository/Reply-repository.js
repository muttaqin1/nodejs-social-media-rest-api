const BaseRepository = require('./Base-Repository');
const Reply = require('../models/Replie');
const {
    AppError: { ApiErrorr },
} = require('../../helpers');
class ReplyRepository extends BaseRepository {
    constructor() {
        super(Reply, 'Reply');
    }

    async Like(reply, userId, replyId) {
        try {
            if (reply?.dislikes?.includes(userId)) {
                await this.PullData(
                    {
                        _id: replyId,
                    },
                    {
                        dislikes: user, //removing the dislike
                    }
                );
            } else if (reply?.likes?.includes(userId)) {
                await this.PullData(
                    {
                        _id: replyId,
                    },
                    {
                        likes: user, //removing the like.
                    }
                );
                return false;
            }
            await this.PullData(
                {
                    _id: replyId,
                },
                {
                    likes: user,
                }
            );
            return true;
        } catch {
            throw new ApiError(`Failed to like ${this.name}`);
        }
    }
    async Dislike(reply, userId, replyId) {
        try {
            if (reply?.likes?.includes(userId)) {
                await this.PullData(
                    {
                        _id: replyId,
                    },
                    {
                        likes: userId, //removing the like
                    }
                );
            } else if (reply?.dislikes?.includes(userId)) {
                await this.PullData(
                    {
                        _id: replyId,
                    },
                    {
                        dislikes: userId, //removing the dislike
                    }
                );
                return false;
            }

            await this.PushData(
                {
                    _id: replyId,
                },
                {
                    dislikes: userId, //pushing the dislike.
                }
            );
            return true;
        } catch {
            throw new ApiError();
        }
    }
}

module.exports = ReplyRepository;
