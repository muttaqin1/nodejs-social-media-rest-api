const BaseRepository = require('./Base-Repository');
const Post = require('../models/Post');

class PostRepository extends BaseRepository {
    constructor() {
        super(Post, 'post');
    }
}
module.exports = PostRepository;
