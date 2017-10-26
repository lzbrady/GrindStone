const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const jobsSchema = new mongoose.Schema({
    
});

const Job = mongoose.model('Project', jobsSchema);
module.exports = Job;