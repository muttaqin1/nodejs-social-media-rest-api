const BaseRepository = require('./Base-Repository');
const Profile = require('../models/Profile');
const {
    AppError: { ApiError },
} = require('../../helpers');

class ProfileRepository extends BaseRepository {
    constructor() {
        super(Profile, 'Profile');
    }

    async Unfollow(profileToFollow, loggedInUserId) {
        try {
            await this.PullData(
                {
                    _id: profileToFollow?._id,
                },
                {
                    followers: loggedInUserId,
                }
            );

            await this.PullData(
                {
                    user: loggedInUserId,
                },
                {
                    following: profileToFollow?.user,
                }
            );
        } catch {
            throw new ApiError('Failed to unfollow user.');
        }
    }

    async Follow(profileToFollow, loggedInUserId) {
        try {
            await this.SetData(
                {
                    _id: profileToFollow?._id,
                },
                {
                    followers: loggedInUserId,
                }
            );
            await this.SetData(
                {
                    user: loggedInUserId,
                },
                {
                    following: profileToFollow?.user,
                }
            );
        } catch {
            throw new ApiError('Failed to follow user');
        }
    }
    async RemoveFriendRequest(sender, reciever) {
        try {
            await this.PullData(
                { user: reciever },
                {
                    friendRequests: sender,
                }
            );
            await this.PullData(
                { user: sender },
                {
                    sendedFriendRequests: reciever,
                }
            );
        } catch {
            throw new ApiError('Failed to remove friend request.');
        }
    }

    async AddFriendRequest(sender, reciever) {
        try {
            await this.PushData(
                { user: reciever },
                {
                    friendRequests: sender,
                }
            );
            await this.PushData(
                { _id: sender },
                {
                    sendedFriendRequests: reciever,
                }
            );
        } catch {
            throw new ApiError('Failed to add friend request.');
        }
    }
    async AcceptFriendRequest(sender, reciever) {
        try {
            await this.PullData(
                { user: reciever },
                {
                    friendRequests: sender,
                }
            );
            await this.PullData(
                { user: sender },
                {
                    sendedFriendRequests: reciever,
                }
            );
            await this.PushData(
                { user: sender },
                {
                    friends: reciever,
                }
            );
            await Profile.PushData(
                { user: reciever },
                {
                    friends: sender,
                }
            );
        } catch {
            throw new ApiError('Failed to accept friend request.');
        }
    }
    async DeleteFriendRequest(sender, reciever) {
        try {
            await this.PullData(
                { user: reciever },
                {
                    friendRequests: sender,
                }
            );
            await this.PullData(
                { user: sender },
                {
                    sendedFriendRequests: reciever,
                }
            );
        } catch {
            throw new ApiError('Failed to delete friend request.');
        }
    }
    async Unfriend(loggedInUser, personToUnfriend) {
        try {
            await this.PullData(
                { user: loggedInUser },
                {
                    friends: personToUnfriend,
                }
            );
            await this.PullData(
                { user: personToUnfriend },
                {
                    friends: loggedInUser,
                }
            );
        } catch {
            throw new ApiError('Failed to unfriend user.');
        }
    }
}

module.exports = ProfileRepository;
