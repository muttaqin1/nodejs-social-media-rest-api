const BaseRepository = require('./Base-Repository');
const Story = require('../models/Storie');
const {
    AppError: { ApiError },
} = require('../../helpers');
class StoryRepository extends BaseRepository {
    constructor() {
        super(Story, 'Story');
    }
}

module.exports = StoryRepository;
