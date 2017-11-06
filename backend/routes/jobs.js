const express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), // mongodb connection
    bodyParser = require('body-parser'), // parse info from POST
    methodOverride = require('method-override'); // used to manipulate POST data
const JOB = mongoose.model('Job');

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
            owner: req.body.owner,
            worker: req.body.worker
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
    .delete((req, res) => {

    });

module.exports = router;