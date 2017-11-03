const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const jobsSchema = new mongoose.Schema({
    name: String,
    description: String,
    comments: [String],
    contactInfo: String,
    userPublisher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Job = mongoose.model('Job', jobsSchema);
module.exports = Job;