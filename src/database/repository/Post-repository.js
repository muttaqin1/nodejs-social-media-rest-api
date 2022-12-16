const BaseRepository = require('./Base-Repository');
const Post = require('../models/Post');
const Profile = require('../models/Profile');
const {
    AppError: { ApiError },
} = require('../../helpers');
class PostRepository extends BaseRepository {
    constructor() {
        super(Post, 'post');
    }
    async GetFriendsAndFollowingPosts(userId) {
        try {
            const { friends, following } = await Profile.findOne({ user: userId });
            const friendsAndFollowings = await Profile.find({
                user: { $and: [{ $in: friends }, { $in: following }] },
            });
            return await this.Find(
                {
                    author: { $in: friendsAndFollowings },
                    privicy: { $ne: 'private' },
                },
                { populate: 'user' }
            );
        } catch {
            throw new ApiError('Failed to get ');
        }
    }
    async LikePost(postId, loggedInUserId) {
        try {
            const post = await this.FindOne({ _id: postId });
            if (post?.dislikes?.includes(loggedInUserId)) {
                await this.PullData(
                    {
                        _id: postId,
                    },
                    {
                        dislikes: loggedInUserId, //removing the dislike
                    }
                );
            } else if (post?.likes?.includes(loggedInUserId)) {
                await this.PullData(
                    {
                        _id: postId,
                    },
                    {
                        likes: loggedInUserId, //removing the like
                    }
                );
                return 'Like removed.';
            }

            await this.PushData(
                {
                    _id: postId,
                },
                {
                    likes: loggedInUserId, //adding the like
                }
            );
            return 'Like Added.';
        } catch {
            throw new ApiError();
        }
    }
    async DislikePost(postId, loggedInUserId) {
        try {
            const post = await this.FindOne({ _id: postId });
            if (post?.likes?.includes(loggedInUserId)) {
                await this.PullData(
                    {
                        _id: postId,
                    },
                    {
                        likes: loggedInUserId, //removing the like.
                    }
                );
            } else if (post?.dislikes?.includes(loggedInUserId)) {
                await this.PullData(
                    {
                        _id: postId,
                    },
                    {
                        dislikes: loggedInUserId, //removing the dislike.
                    }
                );
                return 'Dislike removed.';
            }

            await this.PushData(
                {
                    _id: postId,
                },
                {
                    dislikes: loggedInUserId, //adding the like
                }
            );
            return 'Dislike Added.';
        } catch {
            throw new ApiError();
        }
    }
}
module.exports = PostRepository;
