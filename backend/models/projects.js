const mongoose = require('mongoose');
const projectsSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageURL: String,
    comment: [String],
    email: String,
    owner: String,
    worker: String
});

const Project = mongoose.model('Project', projectsSchema);
module.exports = Project;