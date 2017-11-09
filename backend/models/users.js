const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    bio: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    skillList: [String],
    reviews: []
});

const User = mongoose.model('User', userSchema);
module.exports = User;