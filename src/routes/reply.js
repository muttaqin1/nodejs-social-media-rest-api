const router = require('express').Router();

const {
    reply: { createReply, editReply, deleteReply, like, dislike },
} = require('../controllers');
const { Authentication } = require('../auth');
const { validationResult } = require('../middlewares');
const { AsyncHandler } = require('../helpers');
const {
    reply: { createReplyValidator, editReplyValidator },
    objectIdValidator,
} = require('./validators');

router.post(
    '/post/comment/reply/:id',
    Authentication,
    objectIdValidator,
    createReplyValidator,
    validationResult,
    AsyncHandler(createReply)
);
router.put(
    '/post/comment/reply/:id',
    Authentication,
    objectIdValidator,
    editReplyValidator,
    validationResult,
    AsyncHandler(editReply)
);

router.delete(
    '/post/comment/reply/:id',
    Authentication,
    objectIdValidator,
    validationResult,
    AsyncHandler(deleteReply)
);
router.put(
    '/post/comment/reply/like/:id',
    Authentication,
    objectIdValidator,
    validationResult,
    AsyncHandler(like)
);
router.put(
    '/post/comment/reply/dislike/:id',
    Authentication,
    objectIdValidator,
    validationResult,
    AsyncHandler(dislike)
);

module.exports = router;
