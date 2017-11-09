const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();


const router = express.Router();
const methodOverride = require('method-override'); // used to manipulate POST data

router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(methodOverride((req) => {
    if (req.body && typeof req.body == 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

const port = process.env.PORT || 3000;
let dbURI = 'mongodb://localhost/grindstonedb';
if (process.env.NODE_ENV === 'production') {
    dbURI = process.env.MLAB_URI;
}


require("./models/projects");
require("./models/jobs");
require("./models/users");

const USER = mongoose.model('User');
let thisUser = {};

const projectRoute = require('./routes/projects');
const jobsRoute = require('./routes/jobs');
const userRoute = require('./routes/user');
// const myAccountRoute = require('./routes/my-account');

mongoose.connect(dbURI, {
    useMongoClient: true
}, (err, res) => {
    if (err) {
        console.log(`ERROR connecting to ${dbURI}.${err}`);
    } else {
        console.log(`Successfully connected to ${dbURI}.`);
    }
});

/*  Error handling function.  Invoke with error information. */
function handleError(err, res, msg, statusCode) {
    res.status(statusCode);
    err.status = statusCode;
    err.message = `${err.status}, ${msg}. ${err.message}`;
    res.json(err);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());

app.use(logger('dev'));


let token;
const LocalStorage = require('node-localstorage').LocalStorage;
const localStore = new LocalStorage('./scratch');

// Log in a user
app.post('/login', (req, res) => {
    if (req.body.username &&
        req.body.password) {
        USER.findOne({
            username: req.body.username
        }, (err, user) => {
            if (err) {
                res.json(err);
            } else if (user) {
                thisUser = user;
                bcrypt.compare(req.body.password, user.hash, (err, resp) => {
                    if (resp) {
                        const payload = {
                            username: user.username
                        };
                        token = jwt.sign(payload, 'secret', {
                            expiresIn: 86400
                        });

                        res.json({
                            success: true,
                            message: "Authentication successful.",
                            token: token,
                            user: user
                        });
                    } else {
                        res.json({
                            sucess: false,
                            message: "Authentication failed."
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
    } else {
        res.json({
            sucess: false,
            message: "Authentication failed."
        });
    }
});

// Logs out a user
app.post('/logout', (req, res) => {
    if (req && req.username) {
        token = null;
        thisUser = null;
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
                        thisUser = {
                            username: req.body.username,
                            email: req.body.email,
                            hash: hash,
                            bio: "No Bio Yet",
                            skillList: [],
                            reviews: []
                        };

                        USER.create(thisUser, (err, user) => {
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

// Security
app.use(function (req, res, next) {
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
// app.use('/profile', myAccountRoute);

// Get a user
app.get('/profile/:username', (req, res) => {
    console.log(req.query);
    if (req.query.isMyAccount && req.query.isMyAccount === "true") {
        res.json(thisUser);
    } else if (req.params.username) {
        USER.findOne({
            'username': req.params.username
        }, (err, user) => {
            if (user) {
                res.json({
                    username: user.username,
                    email: user.email,
                    bio: user.bio,
                    reviews: user.reviews,
                    skillList: user.skillList
                });
            } else {
                res.json(err);
            }
        });
    } else {
        res.json("Not logged in");
    }
});

// Add a skill
function addSkill(req, res) {
    thisUser.skillList.push(req.body.skill);
    thisUser.save((err, u) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                username: thisUser.username,
                email: thisUser.email,
                bio: thisUser.bio,
                reviews: thisUser.reviews,
                skillList: thisUser.skillList
            });
        }
    });
}

// Add a review
function addReview(req, res) {
    const review = {
        rating: req.body.rating,
        description: req.body.description,
        reviewer: thisUser.username
    };
    thisUser.reviews.push(review);
    thisUser.save((err, u) => {
        if (err) {
            res.json(err);
        } else {
            res.json({
                username: thisUser.username,
                email: thisUser.email,
                bio: thisUser.bio,
                reviews: thisUser.reviews,
                skillList: thisUser.skillList
            });
        }
    });
}

// Post a comment or review
app.post('/profile/:username', (req, res) => {
    if (req.params && req.params.username) {
        if (thisUser) {
            if (req.body.skill) {
                addSkill(req, res);
            } else if (req.body.rating && req.body.description) {
                addReview(req, res);
            } else {
                res.json("Action could not be performed");
            }
        } else {
            res.json("Action could not be performed");
        }
    }
});

app.listen(port, function () {
    console.log(`Listening on port number ${port}.`);
});


module.exports = app;