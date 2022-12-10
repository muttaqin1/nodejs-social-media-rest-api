const BaseRepository = require('./Base-Repository');
const Profile = require('../models/Profile');

class ProfileRepository extends BaseRepository {
    constructor() {
        super(Profile, 'Profile');
    }
}

module.exports = ProfileRepository;
