const router = require('express').Router();
const { Authentication } = require('../auth');
const {
    profile: { getMyProfile, getUserProfile, createProfile, editProfile },
} = require('../controllers');
const {
    profile: { profileValidator, objectIdValidator },
} = require('./validators');
const {
    AsyncHandler,
    fileUpload: { singleImageUploader },
} = require('../helpers');
const { validationResult } = require('../middlewares');

router.get(
    '/user/profile/:id',
    objectIdValidator('id'),
    validationResult,
    Authentication,
    AsyncHandler(getUserProfile)
);
router.get('/user/profile', Authentication, AsyncHandler(getMyProfile));
router.post(
    '/user/profile',
    singleImageUploader('Avatar', 'Avatars'),
    profileValidator,
    Authentication,
    AsyncHandler(createProfile)
);

router.put('/user/profile', Authentication, profileValidator, AsyncHandler(editProfile));

module.exports = router;
