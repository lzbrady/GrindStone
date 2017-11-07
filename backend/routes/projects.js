const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), // mongodb connection
    bodyParser = require('body-parser'), // parse info from POST
    methodOverride = require('method-override'); // used to manipulate POST data
const PROJECT = mongoose.model('Project');

const jwt = require('express-jwt');
const auth = jwt({
    secret: 'Temp_Secret',
    userProperty: 'payload'
});

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

function makeComment(req, res, project) {
    const comment = {
        comment: req.body.comment,
        name: req.body.name  
    };
    project.comments.push(comment);
    project.save((err, p) => {
        if (err) {
            handleError(err, res, 'Comment could not be handled');
        } else {
            res.json(p);
        }
    });
}

router.route('/')
    //GET all projects
    .get((req, res) => {
        PROJECT.find({}, (err, projects) => {
            if (err) {
                handleError(err, res, 'Not Found', 404);
            } else {
                res.json(projects);
            }
        });
    })
    //ADD a project
    .post((req, res) => {
        console.log(req.body);
        PROJECT.create({
            name: req.body.name,
            description: req.body.description,
            comments: [],
            email: req.body.email,
            owner: req.body.owner,
            worker: req.body.worker
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

router.route('/:projectId')
    .get((req, res) => {
        if (req.params && req.params.projectId) {
            PROJECT.findById(req.params.projectId, (err, project) => {
                if (err) {
                    handleError(err, res, 'Not Found', 404);
                } else {
                    res.json(project);
                }
            });
        } else {
            handleError(new Error(), res, 'GET error, problem retrieving data', 404);
        }
    })
    .post((req, res) => {
        if (req.params && req.params.projectId) {
            PROJECT.findById(req.params.projectId, (err, project) => {
                if (err) {
                    handleError(err, res, 'Project not found', 404);
                } else {
                    makeComment(req, res, project);
                }
            });
        } else {
            handleError({}, res, 'GET error, problem retrieving data', 404);
        }
    })
    .delete((req, res) => {

    });

module.exports = router;