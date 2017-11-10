const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), // mongodb connection
    bodyParser = require('body-parser'), // parse info from POST
    methodOverride = require('method-override'); // used to manipulate POST data
const JOB = mongoose.model('Job');

const LocalStorage = require('node-localstorage').LocalStorage;
const localStore = new LocalStorage('./scratch');

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

function makeComment(req, res, job) {
    const comment = {
        comment: req.body.comment,
        name: req.body.name
    };
    job.comments.push(comment);
    job.save((err, j) => {
        if (err) {
            handleError(err, res, 'Comment could not be handled');
        } else {
            res.json(j);
        }
    });
}

router.route('/')
    //GET all jobs
    .get((req, res) => {
        JOB.find({}, (err, jobs) => {
            if (err) {
                handleError(err, res, 'Not Found', 404);
            } else {
                res.json(jobs);
            }
        });
    })
    //ADD a job
    .post((req, res) => {
        JOB.create({
            name: req.body.name,
            description: req.body.description,
            deadline: req.body.deadline,
            comments: [],
            email: req.body.email,
            website: req.body.website,
            phone: req.body.phone,
            owner: (localStore.getItem("thisUser") || "Unclaimed")
        }, (err, job) => {
            if (err) {
                res.statusCode = 400;
                err.statusCode = 400;
                res.json(err);
            } else {
                res.json(job);
            }
        });
    });

router.route('/:jobId')
    .get((req, res) => {
        if (req.params && req.params.jobId) {
            JOB.findById(req.params.jobId, (err, job) => {
                if (err) {
                    handleError(err, res, 'Not Found', 404);
                } else {
                    res.json(job);
                }
            });
        } else {
            handleError(new Error(), res, 'GET error, problem retrieving data', 404);
        }
    })
    .post((req, res) => {
        if (req.params && req.params.jobId) {
            JOB.findById(req.params.jobId, (err, job) => {
                if (err) {
                    handleError(err, res, 'Project not found', 404);
                } else {
                    makeComment(req, res, job);
                }
            });
        } else {
            handleError({}, res, 'GET error, problem retrieving data', 404);
        }
    })
    .delete((req, res) => {

    });

module.exports = router;