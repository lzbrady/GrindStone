const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    skillList: [String],
    jobList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    projectList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;