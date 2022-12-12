const BaseRepository = require('./Base-Repository');
const User = require('../models/User');
class UserRepository extends BaseRepository {
    constructor() {
        super(User, 'user');
    }
}

module.exports = UserRepository;
