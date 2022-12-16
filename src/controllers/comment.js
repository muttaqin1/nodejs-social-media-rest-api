const {
    PostRepository,
    CommentRepository,
    ReplyRepository,
    NotificationRepository,
} = require('../database');
const commentRepository = new CommentRepository();
const postRepository = new PostRepository();
const replyRepository = new ReplyRepository();
const notificationRepository = new NotificationRepository();

const {
    ApiResponse,
    AppError: { BadRequestError, ForbiddenError },
} = require('../helpers');

const createComment = async (req, res, next) => {
    const { id: postId } = req.params;
    const { _id: loggedInUserId } = req.user;

    //searching the post.
    const post = await postRepository.FindOne({ _id: postId });
    if (!post) throw new BadRequestError('No post exist to comment');

    const comment = await commentRepository.Create({
        body: req.body.body,
        user: loggedInUserId,
        postId,
    });

    //pushing the comment id inside the post (comments Array). and  populating all comments
    const updatedPost = await postRepository
        .PushData(
            {
                _id: postId,
            },
            {
                comments: comment?._id,
            }
        )
        .populate('comments');

    //if the  post author comments  his post. and the post have other commentators. then all the other commentators will be notified that " (author name) also commented on his post"

    //checking if the user is  the  post author
    if (comment?.user?.toString() === updatedPost?.user?.toString()) {
        //notifing all the other commentators.
        await notificationRepository.NotifyAllCommentators(req.user, updatedPost);
    }

    //if the comment creator is not the post author the .a single notification sended to the post author that " (commentator name) commented on your post "
    const notification = await notificationRepository.Create({
        sender: loggedInUserId,
        reciever: post.user,
        event: 'comment',
        source: {
            sourceId: postId,
            referance: 'Post',
        },
    });
    //emit the socket event
    global.io.emit('Notification', notification);

    new ApiResponse(res).data({ comment }).send();
};

const editComment = async (req, res, next) => {
    const { id: commentId } = req.params;
    const { _id: loggedInUserId } = req.user;

    //finds the comment
    const comment = await commentRepository.FindOne({
        _id: commentId,
    });
    if (!comment) throw new BadRequestError('No comment exist to edit.');

    if (comment?.user?.toString() !== loggedInUserId?.toString())
        throw new ForbiddenError('Only comment creator can edit their comment.');
    const updatedComment = await commentRepository.SetData(
        {
            _id: commentId,
        },
        {
            body: req.body.body,
        }
    );
    new ApiResponse(res).data({ updatedComment }).send();
};

const deleteComment = async (req, res, next) => {
    const { commentId } = req.params;
    const comment = await Comment.findOne({
        _id: commentId,
    });
    if (!comment) throw new BadRequestError('No comment exist to delete.');
    if (comment?.user?.toString() !== loggedInUserId.toString())
        throw new ForbiddenError('Only comment creator can delete his comment.');
    await commentRepcommentRepository.DeleteOne({
        _id: commentId,
    });
    await postRepository.PullData(
        {
            _id: comment.postId, //removing the comment id from the post
        },
        {
            comments: comment._id,
        }
    );
    await replyRepository.DeleteMany({ _id: { $in: comment.replies } }); //deleting all the replies.
    new ApiResponse(res).msg('Comment deleted.').send();
};

const like = async (req, res, next) => {
    const { id: commentId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const comment = await commentRepository.FindOne({
        _id: commentId,
    });
    if (!comment) throw new BadRequestError('no comment exist!');
    const result = await commentRepository.Like(comment, loggedInUserId, commentId);
    //notifing the post auther that (user name) liked your comment.
    if (comment?.user?.toString() !== loggedInUserId?.toString()) {
        const notification = await notificationRepository.Create({
            sender: loggedInUserId,
            reciever: comment?.user,
            event: 'like',
            source: {
                sourceId: comment?._id,
                referance: 'Comment',
            },
        });
        global.io.emit('Notification', notification);
    }
    new ApiResponse(res).data({ like: result }).send();
};

const dislike = async (req, res, next) => {
    const { commentId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const comment = await commentRepository.FindOne({
        _id: commentId,
    });
    if (!comment) throw new BadRequestError('no comment exist!');
    //checking if the user have liked the comment .if liked then the like will be removed.

    const result = await commentRepository.Dislike(comment, loggedInUserId, commentId);
    new ApiResponse(res).data({ dislike: result }).send();
};

module.exports = {
    createComment,
    editComment,
    deleteComment,
    like,
    dislike,
};
