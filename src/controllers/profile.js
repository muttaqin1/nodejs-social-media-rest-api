const {
    user: { defaultAvatar },
} = require('../config');
const {
    fileUpload: {
        cloudinary: { uploader },
    },
} = require('../helpers');
const { ProfileRepository, UserRepository } = require('../database');
const profileRepository = new ProfileRepository();
const userRepository = new UserRepository();
const {
    AppError: { BadRequestError, NotFoundError },
    ApiResponse,
} = require('../helpers');

const getUserProfile = async (req, res, next) => {
    const { id } = req.params;
    const profile = await profileRepository.FindOne(
        {
            user: id,
        },
        { populate: 'user following followers friends' }
    );
    if (!profile) throw new NotFoundError('Profile Not Found!');
    new ApiResponse(res).data({ profile }).send();
};

const getMyProfile = async (req, res, next) => {
    const { _id: userId } = req.user;
    const profile = await profileRepository.FindOne(
        {
            user: userId,
        },
        { populate: 'user following followers friends' }
    );
    if (!profile) throw new NotFoundError('Profile Not Found!');
    new ApiResponse(res).data({ profile }).send();
};
const createProfile = async (req, res, next) => {
    const { nickname, bio, address, occupation, worksAt, hobby } = req.body;
    const { _id: userId, name } = req.user;
    const data = {
        nickname,
        bio,
        address,
        occupation,
        worksAt,
        hobby,
        user: userId,
        name,
    };

    if (req?.image) data.avatar = req.image;
    else data.avatar = defaultAvatar;
    const exists = await profileRepository.FindOne({
        user: userId,
    });
    if (exists && exists?._id) throw new BadRequestError('Profile Already Exists!');
    const profile = await profileRepository.Create(data);
    await userRepository.SetData(
        {
            _id: userId,
        },
        {
            profile: profile?._id,
        }
    );
    new ApiResponse(res).data({ profile }).send();
};

const editProfile = async (req, res, next) => {
    const { profile: userProfile } = req.user;
    if (req.image) {
        const profile = await profileRepository.FindOne({ _id: userProfile });
        if (profile) await uploader.destroy(profile?.avatar?.public_id);
        req.body.avatar = req.image;
    }

    const editedProfile = await profileRepository.SetData(
        {
            _id: userProfile,
        },
        req.body
    );
    new ApiResponse(res).data({ editedProfile }).send();
};

module.exports = {
    getMyProfile,
    getUserProfile,
    createProfile,
    editProfile,
};
