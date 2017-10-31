const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), // mongodb connection
    bodyParser = require('body-parser'), // parse info from POST
    methodOverride = require('method-override'); // used to manipulate POST data
const PROJECT = mongoose.model('Project');

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

function handleError(err, res, msg, statusCode) {
    res.status(statusCode);
    err.status = statusCode;
    err.message = msg;
    res.json({
        message: err.status + ' ' + err
    });
}

router.route('/')
    //GET all projects
    .get((req, res) => {
        PROJECT.find({}, (err, projects) => {
            if (err) {
                handleError(err, res, "No Projects Found", 404);
            } else {
                res.json(projects);
            }
        });
    })
    //ADD a project
    .post((req, res) => {
        console.log("TEST");
        console.log(req.params);
        console.log(req.body);
        PROJECT.create({
            name: req.body.name,
            description: req.body.description,
            comment: [],
            contactInfo: req.body.contactInfo,
            userPublisher: req.body.userPublisher,
            userWorker: req.body.userWorker
        }, (err, project) => {
            if (err) {
                res.statusCode = 400;
                err.statusCode = 400;
                res.json(err);
            } else {
                res.json(project);
            }
        });
    });

module.exports = router;