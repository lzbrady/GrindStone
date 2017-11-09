const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();

const port = 3000;
const dbURI = 'mongodb://localhost/grindstonedb';

require("./models/projects");
require("./models/jobs");
require("./models/users");

const USER = mongoose.model('User');

const projectRoute = require('./routes/projects');
const jobsRoute = require('./routes/jobs');
const userRoute = require('./routes/user');

mongoose.connect(dbURI, {
    useMongoClient: true
}, (err, res) => {
    if (err) {
        console.log(`ERROR connecting to ${dbURI}.${err}`);
    } else {
        console.log(`Successfully connected to ${dbURI}.`);
    }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

app.use(logger('dev'));


let token;

// Log in a user
app.post('/login', (req, res) => {
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
                        token = jwt.sign(payload, 'secret', {
                            expiresIn: 360000
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
        res.json({
            sucess: false,
            message: "Authentication failed."
        });
    }
});

app.post('/logout', (req, res) => {
    if (req && req.username) {
        token = null;
        res.json('Logged out');
    }
});

// Register a user
app.post('/register', (req, res) => {
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



app.use(function (req, res, next) {
    console.log(req);

    if (token) {
        jwt.verify(token, 'secret', function (err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Failed to authenticate'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(403).send({
            success: false,
            message: 'No token'
        });
    }
});

app.use('/projects', projectRoute);
app.use('/jobs', jobsRoute);
app.use('/users', userRoute);

app.listen(port, function () {
    console.log(`Listening on port number ${port}.`);
});

module.exports = app;