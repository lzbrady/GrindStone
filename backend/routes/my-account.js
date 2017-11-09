const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), // mongodb connection
    bodyParser = require('body-parser'), // parse info from POST
    methodOverride = require('method-override'); // used to manipulate POST data
const USER = mongoose.model('User');

router.get('/:username', (req, res) => {
    if (req.params.username) {
        USER.findOne({
            username: req.params.username
        }, (err, user) => {
            if (err) {
                res.json(err);
            } else {
                res.json(user);
            }
        });
    }
});

module.exports = router;