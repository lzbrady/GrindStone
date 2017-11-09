const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const USER = mongoose.model('User');

// passport.serializeUser(function (user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//     USER.findById(id, function (err, user) {
//         done(err, user);
//     });
// });

// passport.use('local-login', new LocalStrategy({
//     username: 'username',
//     password: 'password'
// }, (uname, password, done) => {
//     USER.findOne({
//         uname: uname
//     }, function (err, user) {
//         if (err) {
//             return done(err);
//         }
//         if (!user) {
//             return done(null, false, {});
//         }
//         if (!USER.validPassword(password, user.password)) {
//             return done(null, false, {});
//         }
//         return done(null, user);
//     });
// }));

/* GET home page. */
// router.get('/', (req, res) => {
//     if (req.body.username &&
//         req.body.email &&
//         req.body.password) {
//         USER.findOne({
//             'username': req.body.username
//         }, (err, user) => {
//             if (user) {
//                 res.json("Username Taken");
//             } else {
//                 const hash = passwordHash.generate(req.body.password);
//                 console.log(hash);
//                 const userData = {
//                     username: req.body.username,
//                     email: req.body.email,
//                     password: hash,
//                     skillList: [],
//                     projectList: [],
//                     jobList: []
//                 };
//             }
//         });
//     }
// });

// Log in a user
router.post('/login', (req, res) => {
    if (req.body.username &&
        req.body.password) {
        USER.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                res.json(err);
            } else {
                bcrypt.compare(req.body.password, user.hash, (err, resp) => {
                    if (resp) {
                        const payload = {
                            username: user.username
                        };
                        const token = jwt.sign(payload, 'secret', {
                            expiresIn: "1h"
                        });

                        res.json({
                            success: true,
                            message: "Authentication successful.",
                            token: token
                        });
                    } else {
                        res.json({
                            sucess: false,
                            message: "Authentication failed."
                        });
                    }
                });
            }
        });
    } else {
        res.json("User not found");
    }
});

// Register a user
router.post('/register', (req, res) => {
    if (req.body.username &&
        req.body.email &&
        req.body.password) {
        USER.findOne({
            'email': req.body.email
        }, (err, user) => {
            if (user) {
                res.json("Email taken");
            }
        });
        USER.findOne({
            'username': req.body.username
        }, (err, user) => {
            if (user) {
                res.json("Username Taken");
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        res.json("Unable to create user");
                    } else {
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
    }
});

// router.post('/login', passport.authenticate(LocalStrategy), (req, res) => {
//     console.log("Successful");
// });

// router.post('/login', (req, res, next) => {
//     console.log(req.body);
//     console.log("Hash: " + passwordHash.generate(req.body.password));
//     if (req.body.username && req.body.password) {
//         USER.findOne({
//             'username': req.body.username,
//         }, (err, user) => {
//             if (err) {
//                 res.json(err);
//             } else {
//                 const hash = passwordHash.generate(req.body.password);
//                 if (passwordHash.verify(req.password, hash)) {
//                     res.json(user);
//                 }
//                 res.json("Invalid credentials");
//             }
//         });
//     }
// });

module.exports = router;