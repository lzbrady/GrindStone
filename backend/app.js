const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const passport = require('passport');
// const session = require('express-session');
// const localStrategy = require('passport-local').Strategy;

const app = express();

const port = 3000;
const dbURI = 'mongodb://localhost/grindstonedb';

require("./models/projects");
require("./models/jobs");
require("./models/users");

const projectRoute = require('./routes/projects');
const jobsRoute = require('./routes/jobs');
const authRoute = require('./routes/index');
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

app.use('/', authRoute);

app.use(function(req, res, next) {
    const token = req.body.token || req.query.token || req.headers.token['x-access-token'];

    if (token) {
        jwt.verify(token, 'secret', function(err, decoded) {
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

module.exports = {
    'secret': 'thisismysecretivesecret',
};
module.exports = app;
