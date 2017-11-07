const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const USER = mongoose.model('User');

/* GET home page. */
router.get('/', (req, res) => {
    if (req.body.username &&
        req.body.email &&
        req.body.password) {
        USER.findOne({
            'username': req.body.username
        }, (err, user) => {
            if (user) {
                res.json("Username Taken");
            } else {
                const hash = passwordHash.generate(req.body.password);
                console.log(hash);
                const userData = {
                    username: req.body.username,
                    email: req.body.email,
                    password: hash,
                    skillList: [],
                    projectList: [],
                    jobList: []
                };
            }
        });
    }
});

router.post('/', (req, res) => {
    if (req.body.username &&
        req.body.email &&
        req.body.password) {
        USER.findOne({
            'username': req.body.username
        }, (err, user) => {
            if (user) {
                res.json("Username Taken");
            } else {
                const hash = passwordHash.generate(req.body.password);
                console.log(hash);
                const userData = {
                    username: req.body.username,
                    email: req.body.email,
                    hash: hash,
                    skillList: [],
                    projectList: [],
                    jobList: []
                };

                USER.create(userData, (err, user) => {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(user);
                    }
                });
            }
        });

    }
});

router.post('/login', (req, res) => {
    console.log(req.body);
    console.log("Hash: " + passwordHash.generate(req.body.password));
    if (req.body.username && req.body.password) {
        USER.findOne({
            'username': req.body.username,
        }, (err, user) => {
            if (err) {
                res.json(err);
            } else {
                const hash = passwordHash.generate(req.body.password);
                if (passwordHash.verify(req.password, hash)) {
                    res.json(user);
                }
                res.json("Invalid credentials");
            }
        });
    }
});

module.exports = router;