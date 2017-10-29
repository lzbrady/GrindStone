const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const projectsSchema = new mongoose.Schema({
    name: String,
    description: String,
    comment: [String],
    contactInfo: String,
    userPublisher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userWorkers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Project = mongoose.model('Project', projectsSchema);
module.exports = Project;