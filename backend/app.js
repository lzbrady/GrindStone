const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const localStrategy = require('passport-local').Strategy;

const app = express();

const port = 3000;
const dbURI = 'mongodb://localhost/grindstonedb';

require("./models/projects");
require("./models/jobs");
require("./models/users");

const projectRoute = require('./routes/projects');
const jobsRoute = require('./routes/jobs');
const authRoute = require('./routes/index');

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

app.use('/projects', projectRoute);
app.use('/jobs', jobsRoute);
app.use('/', authRoute);

app.listen(port, function () {
    console.log(`Listening on port number ${port}.`);
});

module.exports = app;