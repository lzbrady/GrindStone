const mongoose = require('mongoose');
const projectsSchema = new mongoose.Schema({
    name: String,
    description: String,
    comments: [],
    email: String,
    owner: String
});

const Project = mongoose.model('Project', projectsSchema);
module.exports = Project;