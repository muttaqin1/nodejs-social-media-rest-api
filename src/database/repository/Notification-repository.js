const BaseRepository = require('../repository/Base-Repository');
const Notification = require('../models/Notification');
const Profile = require('../models/Profile');
class NotificationRepository extends BaseRepository {
    constructor() {
        super(Notification, 'Notification');
    }
    async AlertStory(story) {
        try {
            const { user, friends } = await Profile.findOne({
                user: story?.creator,
            });
            if (friends?.length <= 0) return;
            friends.forEach(async (userId) => {
                await this.Create({
                    sender: user,
                    reciever: userId,
                    event: 'story',
                    source: {
                        sourceId: story._id,
                        referance: 'Storie',
                    },
                });
            });
        } catch {
            throw new ApiError('Failed to alert friends');
        }
    }
    async NotifyAllCommentators(source, sender) {
        try {
            const post = source;
            const user = sender;
            const commentators = post.comments.filter(
                (comments, index, array) =>
                    comments?.user?.toString() !== sender?._id?.toString() &&
                    array.findIndex((data) => data.user.toString() === comments.user.toString()) ===
                        index
            );
            if (commentators.length <= 0) {
                return;
            }
            commentators.forEach(async (comments) => {
                await this.Create({
                    sender: user?._id,
                    reciever: comments.user,
                    event: 'custom',
                    text: `${user.name} also commented on ${
                        user.gender === 'male' ? 'his' : 'her'
                    } post`,
                    source: {
                        sourceId: source?._id,
                        referance: 'Post',
                    },
                });
            });
        } catch {
            throw new ApiError();
        }
    }
    async NotifyAllRepliers(sender, source) {
        try {
            const user = sender;
            const comment = source;
            if (comment?.replies?.length <= 0) {
                return;
            }

            const replies = comment?.replies?.filter(
                (replyObject, index, arr) =>
                    replyObject?.user?.toString() !== sender?._id?.toString() &&
                    arr.findIndex(
                        (repObj) => repObj?.user?.toString() === replyObject?.user?.toString()
                    ) === index
            );

            replies?.forEach(async (replyObject) => {
                await this.Create({
                    sender: sender?._id,
                    reciever: replyObject?.user,
                    event: 'custom',
                    text: `${user?.name} replied to ${
                        user?._id?.toString() === comment?.user?._id?.toString()
                            ? 'his'
                            : `${comment?.user?.name}'\s`
                    } comment`,
                    source: {
                        sourceId: source?._id,
                        referance: 'Comment',
                    },
                });
            });
        } catch {
            throw new ApiError();
        }
    }
}

module.exports = NotificationRepository;
