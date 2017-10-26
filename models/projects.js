const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const projectsSchema = new mongoose.Schema({
    
});

const Project = mongoose.model('Project', projectsSchema);
module.exports = Project;