const { ProfileRepository, NotificationRepository } = require('../database');

const profileRepository = new ProfileRepository();
const notificationRepository = new NotificationRepository();
const {
    AppError: { BadRequestError, ForbiddenError },
} = require('../helpers');
const ApiResponse = require('../helpers');

const followAndUnfollow = async (req, res, next) => {
    const { id: userId } = req.params;
    const { _id: loggedInUserId } = req.user;

    const profileToFollow = await profileRepository.FindOne({ user: userId });
    if (!profileToFollow)
        throw new BadRequestError('The person you want to follow dont have a profile.');

    const loggedInUserProfile = await profileRepository.FindOne({ user: loggedInUserId }); //searching the logged in user profile
    if (!loggedInUserProfile) throw new BadRequestError('Profile is required to follow someone!');

    if (profileToFollow?.user?.toString() === loggedInUserProfile?.user?.toString())
        throw new ForbiddenError();
    //checking if the logged in user already follows the person .then i will let him unfollow the user
    if (profileToFollow?.followers?.includes(loggedInUserId)) {
        await profileRepository.Unfollow(profileToFollow, loggedInUserId);
        new ApiResponse(res).msg('User unfollowed successfully.').send();
    }
    //if the logged in user dont follow the user then i will let him follow the user
    await profileRepository.Follow(profileToFollow, loggedInUserId);

    //creating a notification
    const notification = await notificationRepository.Create({
        sender: loggedInUserId,
        reciever: profileToFollow.user,
        event: 'follow',
        source: {
            sourceId: loggedInUserProfile._id,
            referance: 'Profile',
        },
    });
    global.io.emit('Notification', notification);
    new ApiResponse(res).msg('User followed successfully.').send();
};

const FriendList = async (req, res, next) => {
    const { _id: loggedInUser } = req.user;
    const profile = await profileRepository.FindOne(
        { user: loggedInUser },
        { populate: 'friends' }
    ); //populating all the friends
    if (!profile) throw new BadRequestError('you have to create a profile first');
    new ApiResponse(res).data({ friends: profile.friends }).send();
};

const friendRequests = async (req, res, next) => {
    const { _id: loggedInUser } = req.user;
    const profile = await profileRepository.FindOne(
        { user: loggedInUser },
        { populate: 'friendRequests' }
    );

    if (!profile) throw new BadRequestError('you have to create a profile first!');
    new ApiResponse(res).data({ friendRequests: profile.friendRequests }).send();
};

const addFriend = async (req, res, next) => {
    const { userId } = req.params;
    const { _id: loggedInUserId } = req.user;
    if (loggedInUserId?.toString() === userId?.toString()) throw new ForbiddenError();
    const profile = await profileRepository.FindOne({ user: userId });
    const loggedInUserProfile = await profileRepository.FindOne({ user: loggedInUserId });
    if (!profile) throw new BadRequestError('users profile doesnt exist!');
    if (profile?.friends?.includes(loggedInUserId))
        throw new BadRequestError('user is already in your friend list');
    if (profile?.friendRequests?.includes(loggedInUserId)) {
        await profileRepository.RemoveFriendRequest(loggedInUserId, userId);
        new ApiResponse(res).msg('Friend request cancelled.').send();
    }
    await profileRepository.AddFriendRequest(loggedInUserId, userId);
    const notification = await notificationRepository.Create({
        sender: loggedInUserId,
        reciever: userId,
        event: 'friendRequest',
        source: {
            sourceId: loggedInUserProfile._id,
            referance: 'Profile',
        },
    });
    global.io.emit('Notification', notification);
    new ApiResponse(res).msg('Friend request sended.').send();
};

const acceptFriendRequest = async (req, res, next) => {
    const { userId } = req.params; //friend req sender id
    const { _id: loggedInUserId } = req.user;
    const loggedInUserProfile = await profileRepository.FindOne({ user: loggedInUserId }); //reciever
    if (!loggedInUserProfile) throw new BadRequestError('Profile is required to accept request');
    if (!loggedInUserProfile?.friendRequests?.includes(userId))
        throw new BadRequestError('No friend request found!');
    const requestSenderProfile = await profileRepository.FindOne({ user: userId });

    if (!requestSenderProfile) throw new BadRequestError('User dont have a profile.');
    if (!requestSenderProfile?.sendedFriendRequests?.includes(loggedInUserId))
        throw new BadRequestError('Invalid friend request!');
    await profileRepository.AcceptFriendRequest(userId, loggedInUserId);

    const notification = await notificationRepository.Create({
        sender: loggedInUserId,
        reciever: userId,
        event: 'acceptFriendRequest',
        source: {
            sourceId: loggedInUserProfile._id,
            referance: 'Profile',
        },
    });
    global.io.emit('Notification', notification);
    new ApiResponse(res).msg(`${requestSenderProfile?.name} is now your friend!`).send();
};

const deleteFriendRequest = async (req, res, next) => {
    const { userId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const requestSenderProfile = await profileRepository.FindOne({ user: userId }); //request sender profile
    const loggedInUserProfile = await profileRepository.FindOne({ user: loggedInUserId });
    if (!loggedInUserProfile?.friendRequests?.includes(userId))
        throw new BadRequestError('no friend request found!');
    if (!requestSenderProfile?.sendedFriendRequests?.includes(loggedInUserId))
        throw new BadRequestError('Invalid friend requaest.');

    await profileRepository.DeleteFriendRequest(userId, loggedInUserId);
    new ApiResponse(res).msg('Friend request deleted successfully.').send();
};

const unfriend = async (req, res, next) => {
    const { userId } = req.params;
    const { _id: loggedInUserId } = req.user;
    if (loggedInUserId?.toString() === userId?.toString())
        throw new Error('failed to unfriend user!');
    const userToUnfriendprofile = await profileRepository.FindOne({ user: userId });
    const loggedInUserProfile = await profileRepository.FindOne({ user: loggedInUserId });
    if (
        !userToUnfriendprofile?.friends?.includes(loggedInUserId) &&
        !loggedInUserProfile?.friends?.includes(userId)
    )
        throw new BadRequestError('User is not in your friend list');
    await profileRepository.Unfriend(loggedInUserId, userId);
    new ApiResponse(res).msg(`${userToUnfriendprofile?.name} is no longer your friend.`).send();
};

module.exports = {
    followAndUnfollow,
    FriendList,
    friendRequests,
    addFriend,
    unfriend,
    acceptFriendRequest,
    deleteFriendRequest,
};
