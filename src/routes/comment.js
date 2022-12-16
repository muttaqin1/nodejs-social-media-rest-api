const router = require('express').Router();

const {
    comment: { createComment, editComment, deleteComment, like, dislike },
} = require('../controllers');
const { Authentication } = require('../auth');
const { validationResult } = require('../middlewares');
const { AsyncHandler } = require('../helpers');
const {
    comment: { createCommentValidator, editCommentValidator },
    objectIdValidator,
} = require('./validators');

router.post(
    '/post/comment/:id',
    Authentication,
    objectIdValidator,
    createCommentValidator,
    validationResult,
    AsyncHandler(createComment)
);
router.put(
    '/post/comment/:id',
    Authentication,
    objectIdValidator,
    editCommentValidator,
    validationResult,
    AsyncHandler(editComment)
);
router.delete(
    '/post/comment/:id',
    Authentication,
    objectIdValidator,
    validationResult,
    AsyncHandler(deleteComment)
);
router.get(
    '/post/comment/like/:id',
    Authentication,
    objectIdValidator,
    validationResult,
    AsyncHandler(like)
);
router.get(
    '/post/comment/dislike/:id',
    Authentication,
    objectIdValidator,
    validationResult,
    AsyncHandler(dislike)
);
module.exports = router;
