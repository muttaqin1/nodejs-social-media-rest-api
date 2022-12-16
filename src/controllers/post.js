const {
    ProfileRepository,
    NotificationRepository,
    CommentRepository,
    PostRepository,
    ReplyRepository,
} = require('../database');
const postRepository = new PostRepository();
const commentRepository = new CommentRepository();
const profileRepository = new ProfileRepository();
const replyRepository = new ReplyRepository();
const notificationRepository = new NotificationRepository();

const {
    fileUpload: {
        cloudinary: { uploader },
    },
    ApiResponse,
    AppError: { ForbiddenError },
} = require('../helpers');

/*
Description: this function takes a user id .search profile and returns all the user posts
*/
const getMyPosts = async (req, res, next) => {
    const { _id: loggedInUserId } = req.user;
    const { posts } = await profileRepository.FindOne(
        { user: loggedInUserId },
        { populate: 'posts' }
    );
    new ApiResponse(res).data({ posts }).send();
};
/*
Description: this function takes a user id .search profile and returns all the user posts
*/
const getPosts = async (req, res, next) => {
    const { _id: loggedInUserId } = req.user;
    const userPostsArray = [];
    const loggedInUserProfile = await profileRepository.FindOne(
        {
            user: loggedInUserId,
        },
        { populate: 'posts' }
    );
    const loggedInUserPosts = loggedInUserProfile.posts.filter(
        (post) => post.privicy.toUpperCase() !== 'PRIVATE'
    );

    const getPublicPosts = await postRepository.Find({ privicy: 'public' });
    const getFriendsAndFollowingPosts = await postRepository.GetFriendsAndFollowingPosts(
        loggedInUserId
    );
    userPostsArray.push(...getPublicPosts);
    userPostsArray.push(...getFriendsAndFollowingPosts);
    userPostsArray.push(...loggedInUserPosts);
    new ApiResponse(res).data({ posts: userPostsArray }).send();
};

/*
Description: this function takes caption and body from req.body and creates a  post.
*/

const createPost = async (req, res, next) => {
    const { caption, body } = req.body;
    const { _id: loggedInUserId } = req.user;
    const data = {
        user: req.user._id,
        caption,
        body,
        privicy,
    };
    if (req.image) post.image = req.image;
    const post = await postRepository.Create(data);
    //pushing the post id in user profile .
    await profileRepository.PushData(
        {
            user: loggedInUserId,
        },
        {
            posts: post?._id,
        }
    );
    new ApiResponse(res).data({ post }).send();
};
/*
Description: this function edits user posts .
*/
const editPost = async (req, res, next) => {
    const { id: postId } = req.params;
    const { caption, body } = req.body;
    const { _id: loggedInUserId } = req.user;
    const post = await postRepository.FindOne({
        _id: postId,
    });
    if (post?.user?.toString() !== loggedInUserId?.toString())
        throw new ForbiddenError('only post author can edit his post.');
    const data = {
        caption,
        body,
    };
    if (req.image) {
        await uploader.destroy(post?.image?.public_id);
        data.image = req.image;
    }
    const updatedPost = await postRepository.SetData({ _id: postId }, data);
    new ApiResponse(res).data({ updatedPost }).send();
};
/*
Description: this function takes a post id and deletes the post
*/
const deletePost = async (req, res, next) => {
    const { id: postId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const post = await postRepository.FindOne({
        _id: postId,
    });
    if (post?.user?.toString() !== loggedInUserId?.toString()) throw new ForbiddenError();

    //deleting post image
    await uploader.destroy(post?.image?.public_id);
    //removing the post id from user profile (Posts Array)
    await profileRepository.PullData(
        {
            user: loggedInUserId,
        },
        {
            posts: postId,
        }
    );

    await postRepository.GetModel().removeChilds(post);
    await postRepository.DeleteOne({ _id: postId });
    new ApiResponse(res).msg('Post deleted.').send();
};

/*
Description: this function takes a postId form req.params and like that post if the user already liked the post this function removes the like.
*/
const like = async (req, res, next) => {
    const { id: postId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const post = await postRepository.FindOne({ _id: postId });
    const result = await postRepository.LikePost(postId, loggedInUserId);

    if (post?.user?.toString() !== loggedInUserId?.toString()) {
        if (result?.toUpperCase() === 'LIKE ADDED') {
            const notification = await notificationRepository.Create({
                //creating a notification
                sender: loggedInUserId,
                reciever: post?.user,
                event: 'like',
                source: {
                    sourceId: post?._id,
                    referance: 'Post',
                },
            });
        }
        global.io.emit('Notification', notification);
    }
    new ApiResponse(res).msg(result).send();
};
/*
Description: this function takes a postId form req.params and dislike that post if the user already disliked the post this function removes the dislike.
*/
const dislike = async (req, res, next) => {
    const { id: postId } = req.params;
    const user = req.user._id;
    const post = await Post.findOne({
        _id: postId,
    });
    const result = await postRepository.DislikePost(postId, loggedInUserId);
    new ApiResponse(res).msg(result).send();
};
module.exports = {
    getMyPosts,
    getPosts,
    createPost,
    editPost,
    deletePost,
    like,
    dislike,
};
