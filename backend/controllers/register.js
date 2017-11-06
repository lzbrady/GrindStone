const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.register = function (req, res) {
    const user = new User();

    user.name = req.body.name;
    user.email = req.body.email;

    user.setPassword(req.body.password);

    user.save(function (err) {
        if (err) {
            res.json(err);
        } else {
            const token = user.generateJwt();
            res.status(200);
            res.json({
                "token": token
            });
        }
    });
};