const { ProfileRepository, StoryRepository, NotificationRepository } = require('../database');
const {
    fileUpload: {
        cloudinary: { uploader },
    },
} = require('../helpers');

const profileRepository = new ProfileRepository();
const storyRepository = new StoryRepository();
const notificationRepository = new NotificationRepository();
const {
    ApiResponse,
    AppError: { ForbiddenError, BadRequestError },
} = require('../helpers');

const getStories = async (req, res, next) => {
    const { _id: loggedInUserId } = req.user;
    const profile = await profileRepository.FindOne({ user: loggedInUserId });
    if (profile.friends.length === 0) {
        const userStory = await storyRepository.FindOne({ creator: loggedInUserId });
        if (!userStory) new ApiResponse(res).data({ stories: [] }).send();
    }
    const getAllStories = profile.friends.unshift(loggedInUserId);
    const stories = Story.find({ creator: { $in: getAllStories } });
    new ApiResponse(res).data({ stories }).send();
};
const getSingleStory = async (req, res, next) => {
    const { id: storyId } = req.params;
    const story = await storyRepository.FindOne({ _id: storyId });
    const storyCreatorProfile = await storyRepository.FindOne({ user: story?.creator });
    if (story?.creator?.toString() === loggedInUserId?.toString())
        new ApiResponse(res).data({ story }).send();

    if (story.privicy.toUpperCase() !== 'PUBLIC') {
        if (!storyCreatorProfile?.friends?.includes(loggedInUserId))
            throw new ForbiddenError('Story is visible to his friends only!');
        return new ApiResponse(res).data({ story }).send();
    }
    new ApiResponse(res).data({ story }).send();
};

const createStory = async (req, res, next) => {
    if (!req.image) throw new BadRequestError('story can not be empty!');
    const story = await storyRepository.Create({
        creator: req.user._id,
        image: req.image,
        privicy: req.body.privicy,
    });
    await notificationRepository.AlertStory(story);
    new ApiResponse(res).data({ story }).send();
};
const deleteStory = async (req, res, next) => {
    const { id: storyId } = req.params;
    const { _id: loggedInUserId } = req.user;
    const story = await StoryRepository.FindOne({ _id: storyId });
    if (!story) throw new BadRequestError('No story found!');
    if (story?.creator?.toString() !== loggedInUserId?.toString())
        throw new ForbiddenError('only creators can delete their story!');
    await uploader.destroy(story?.image?.publicId);
    await storyRepository.DeleteOne({ _id: storyId });
    new ApiResponse(res).data({ story }).send();
};

module.exports = {
    getStories,
    getSingleStory,
    createStory,
    deleteStory,
};
