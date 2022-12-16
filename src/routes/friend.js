const router = require('express').Router();
const {
    friend: {
        followAndUnfollow,
        FriendList,
        friendRequests,
        addFriend,
        unfriend,
        acceptFriendRequest,
        deleteFriendRequest,
    },
} = require('../controllers');
const { Authentication } = require('../auth');
const { validationResult } = require('../middlewares');
const ObjectId = require('./validators/objectId');
const { AsyncHandler } = require('../helpers');

router.get(
    '/profile/follow/:id',
    Authentication,
    ObjectId('id'),
    validationResult,
    AsyncHandler(followAndUnfollow)
);
router.get('/profile/friends', Authentication, AsyncHandler(FriendList));
router.get('/profile/friends/pending', Authentication, AsyncHandler(friendRequests));
router.put(
    '/profile/friends/add/:id',
    Authentication,
    ObjectId('id'),
    validationResult,
    AsyncHandler(addFriend)
);
router.put(
    '/profile/friends/remove/:id',
    Authentication,
    ObjectId('id'),
    validationResult,
    AsyncHandler(unfriend)
);
router.put(
    '/profile/friends/accept/:id',
    Authentication,
    ObjectId('id'),
    validationResult,
    AsyncHandler(acceptFriendRequest)
);
router.delete(
    '/profile/friends/pending/:id',
    Authentication,
    ObjectId('id'),
    validationResult,
    AsyncHandler(deleteFriendRequest)
);

module.exports = router;
