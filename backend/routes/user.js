const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), // mongodb connection
    bodyParser = require('body-parser'), // parse info from POST
    methodOverride = require('method-override'); // used to manipulate POST data

const USER = mongoose.model('User');


router.route('/')
    .get((req, res) => {
        USER.find({}, (err, users) => {
            if (err) {
                res.json(err);
            } else {
                res.json(users);
            }
        });
    });

module.exports = router;