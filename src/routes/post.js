const router = require('express').Router();
const { Authentication } = require('../auth');
const {
    AsyncHandler,
    fileUpload: { singleImageUploader },
} = require('../helpers');
const { validationResult } = require('../middlewares');
const {
    post: { getMyPosts, getPosts, createPost, editPost, deletePost, like, dislike },
} = require('../controllers');
const {
    objectIdValidator,
    post: { createPostValidator, editPostValidator },
} = require('./validators');

router.post(
    '/posts',
    Authentication,
    singleImageUploader('image', 'images'),
    createPostValidator,
    validationResult,
    AsyncHandler(createPost)
);
router.put(
    '/posts/:id',
    Authentication,
    singleImageUploader('image', 'images'),
    objectIdValidator('id'),
    editPostValidator,
    validationResult,
    AsyncHandler(editPost)
);
router.delete(
    '/posts/:id',
    Authentication,
    objectIdValidator('id'),
    validationResult,
    AsyncHandler(deletePost)
);
router.put(
    '/posts/like/:id',
    Authentication,
    objectIdValidator('id'),
    validationResult,
    AsyncHandler(like)
);
router.put(
    '/posts/dislike/:id',
    Authentication,
    objectIdValidator('id'),
    validationResult,
    AsyncHandler(dislike)
);
router.get('/profile/posts', Authentication, AsyncHandler(getMyPosts));
router.get('/posts', Authentication, AsyncHandler(getPosts));

module.exports = router;
