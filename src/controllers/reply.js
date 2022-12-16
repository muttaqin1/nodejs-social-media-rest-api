const { NotificationRepository, CommentRepository, ReplyRepository } = require('../database');
const notificationRepository = new NotificationRepository();
const commentRepository = new CommentRepository();
const replyRepository = new ReplyRepository();
const {
    AppError: { BadRequestError, ForbiddenError },
    ApiResponse,
} = require('../helpers');
const createReply = async (req, res, next) => {
    const { id: commentId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const data = {
        body: req.body.body,
        user: loggedInUserId,
        commentId,
    };

    const comment = await commentRepository.FindOne({ _id: commentId });
    if (!comment) throw new BadRequestError('comment doesnt exist to reply!');
    const reply = await replyRepository.Create(data);
    const updatedComment = await commentRepository.PushData(
        {
            _id: commentId,
        },
        {
            replies: userReply._id,
        },
        {
            populate: 'user replies',
        }
    );
    if (updatedComment?.user?._id?.toString() === loggedInUserId?.toString()) {
        //sending notification to all the others.
        await notificationRepository.NotifyAllRepliers(req.user, updatedComment);
        return new ApiResponse(res).data({ comment: updatedComment }).send();
    }

    //if the person is not the comment creator .also the other persons will be notified.
    const notification = await notificationRepository.Create({
        sender: loggedInUserId,
        reciever: comment?.user,
        event: 'reply',
        source: {
            sourceId: comment?._id,
            referance: 'Comment',
        },
    });
    //emiting the socket event.
    global.io.emit('Notification', notification);

    await notificationRepository.NotifyAllRepliers(req.user, updatedComment);
    new ApiResponse(res).data({ reply }).send();
};
const editReply = async (req, res, next) => {
    const { id: replyId } = req.params;
    const { _id: loggedInUserId } = req.user;
    //searching the reply.
    const reply = await replyRepository.FindOne({
        _id: replyId,
    });
    //throwing error if no reply found.
    if (!reply) throw new BadRequestError('No reply found!');
    if (reply?.user.toString() !== loggedInUserId?.toString())
        throw new ForbiddenError('Only reply creators can edit their reply.');
    const updatedReply = await replyRepository.SetData(
        {
            _id: replyId,
        },
        {
            body: req.body.body,
        }
    );
    new ApiResponse(res).data({ updatedReply }).send();
};
const deleteReply = async (req, res, next) => {
    const { _id: loggedInUserId } = req.user;
    const { replyId } = req.params;
    const reply = await replyRepository.FindOne({
        _id: replyId,
    });
    if (!reply) throw new BadRequestError('no reply found');
    if (reply?.user?.toString() !== loggedInUserId?.toString())
        throw new ForbiddenError('Only reply creators can delete their reply.');
    await replyRepository.DeleteOne({
        _id: replyId,
    });
    await commentRepository.PullData(
        {
            _id: reply?.commentId,
        },
        {
            replies: reply?.id,
        }
    );
    new ApiResponse(res).msg('Reply deleted.').send();
};

const like = async (req, res, next) => {
    const { id: replyId } = req.params;
    const { _id: loggedInUserId } = req.user;

    const reply = await replyRepository.FindOne({
        _id: replyId,
    });
    if (!reply) throw new BadRequestError('no reply found');

    const result = await replyRepository.Like(reply, loggedInUserId, replyId);
    //notifying the comment creator.
    if (reply?.user?.toString() !== user?.toString()) {
        const notification = await notificationRepository.Create({
            sender: loggedInUserId,
            reciever: reply?.user,
            event: 'like',
            source: {
                sourceId: reply?._id,
                referance: 'Replie',
            },
        });

        global.io.emit('Notification', notification);
    }
    new ApiResponse(res).data({ like: result }).send();
};

const dislike = async (req, res, next) => {
    const { replyId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const reply = await replyRepository.FindOne({
        _id: replyId,
    });
    if (!reply) throw new BadRequestError('no reply found');
    const result = await replyRepository.Dislike(reply, loggedInUserId, replyId);
    new ApiResponse(res).data({ dislike: result }).send();
};

module.exports = {
    createReply,
    editReply,
    deleteReply,
    like,
    dislike,
};
