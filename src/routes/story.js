const router = require('express').Router();
const {
    story: { getStories, getSingleStory, createStory, deleteStory },
} = require('../controllers');
const {
    AsyncHandler,
    fileUpload: { singleImageUploader },
} = require('../helpers');
const { Authentication } = require('../auth');
const objectId = require('./validators/objectId');
const { validationResult } = require('../middlewares');

router.get('/profile/story', Authentication, AsyncHandler(getStories));
router.get(
    '/profile/story/:id',
    Authentication,
    objectId('id'),
    validationResult,
    AsyncHandler(getSingleStory)
);
router.post(
    '/profile/story',
    Authentication,
    singleImageUploader('story', 'stories'),
    AsyncHandler(createStory)
);
router.delete('/profile/story/:id', Authentication, objectId('id'), validationResult, deleteStory);

module.exports = router;
