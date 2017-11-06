const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy({
    usernameField: 'username'
}, function (username, password, done) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {
                message: "Username or Password doesn't match"
            });
        }
        if (!user.validPassword(password)) {
            return done(null, false, {
                message: "Username or Password doesn't match"
            });
        }
        return done(null, user);
    });
}));