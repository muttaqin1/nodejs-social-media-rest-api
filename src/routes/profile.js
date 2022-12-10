const router = require('express').Router();
const { Authentication } = require('../auth');
const {
    profile: { getMyProfile, getUserProfile, createProfile, editProfile },
} = require('../controllers');

router.get('/profile/user/:id', Authentication, getUserProfile);
router.get('/profile', Authentication, getMyProfile);
router.post(
    '/profile',
    Authentication,
    //upload.single('avatar'),
    //profileValidator,
    //validationResult,
    createProfile
);
router.put(
    '/profile',
    Authentication,
    //upload.single('avatar'),
    //profileValidator,
    //validationResult,
    editProfile
);

module.exports = router;
