const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const jobsSchema = new mongoose.Schema({
    name: String,
    description: String,
    comments: [String],
    email: String,
    website: String,
    phone: String,
    owner: String,
    worker: String
});

const Job = mongoose.model('Job', jobsSchema);
module.exports = Job;