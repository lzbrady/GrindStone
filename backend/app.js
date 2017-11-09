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
const dbURI = 'mongodb://localhost/grindstonedb';

require("./models/projects");
require("./models/jobs");
require("./models/users");

const USER = mongoose.model('User');

const projectRoute = require('./routes/projects');
const jobsRoute = require('./routes/jobs');
const userRoute = require('./routes/user');
const myAccountRoute = require('./routes/my-account');

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
                bcrypt.compare(req.body.password, user.hash, (err, resp) => {
                    if (resp) {
                        const payload = {
                            username: user.username
                        };
                        token = jwt.sign(payload, 'secret', {
                            expiresIn: 60
                        });


                        localStore.setItem("token", token);

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
                            bio: "No Bio Yet",
                            skillList: [],
                            reviews: []
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
    console.log("Token");
    console.log(token);
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
    } else if (localStore && localStore.getItem("token")) {
        token = localStore.getItem("token");
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
app.use('/profile', myAccountRoute);

app.listen(port, function () {
    console.log(`Listening on port number ${port}.`);
});

router.route('/user')

    // GET all users
    .get((req, res) => {
        USER.find({}, (err, users) => {
            if (err) {
                handleError(err, res, 'Users Not Found', 404);
            } else {
                res.json(users);
            }
        });
    });

module.exports = app;