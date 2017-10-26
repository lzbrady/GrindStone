const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const usersSchema = new mongoose.Schema({
    
});

const User = mongoose.model('Project', userSchema);
module.exports = User;