const BaseRepository = require('../repository/Base-Repository');
const Notification = require('../models/Notification');

class NotificationRepository extends BaseRepository {
    constructor() {
        super(Notification, 'Notification');
    }
}

module.exports = NotificationRepository;
