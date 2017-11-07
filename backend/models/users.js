const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passwordHash = require('password-hash');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    hash: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    skillList: [String],
    jobList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }],
    projectList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

// userSchema.methods.setPassword = function(password) {
//     this.salt = crypto.randomBytes(16).toString('hex');
//     this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
// };

userSchema.methods.isAuthenticated = function(password) {
    return passwordHash.verify(password, passwordHash.generate(password));
};

// userSchema.methods.generateJwt = function() {
//     const expiry = new Date();
//     expiry.setDate(expiry.getDate() + 7);

//     return jwt.sign({
//         _id: this._id,
//         email: this.email,
//         username: this.username,
//         skillList: this.skillList,
//         jobList: this.jobList,
//         projectList: this.projectList,
//         exp: parseInt(expiry.getTime() / 1000),
//     }, "Temp_Secret");
// };

const User = mongoose.model('User', userSchema);
module.exports = User;