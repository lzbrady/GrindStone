(function () {
    "use strict";
    const apiUrl = "http://localhost:3000/projects/";
    let allProjects;

    function getAllProjects() {
        $(".wrapper").empty();
        $.ajax({
            url: apiUrl,
            dataType: 'JSON',
            type: 'GET',
            success: (data) => {
                if (data) {
                    allProjects = data;
                    displayAllProjects(allProjects);
                } else {
                    displayAllProjects(null);
                }
            },
            error: (request, status, error) => {
                console.log("ERROR " + error);
            }
        })
    }

    function createAddProjectForm() {
        $(".wrapper").empty();
        const container = $("#add-project-div").empty();
        const form = $('<form name="create-project-form">');
        const submitButton = $('<button id="create-project-btn" type="submit" class="table-cell"> Create Project </button>');
        //Name
        form.append('<label for="name">Name</label>');
        form.append('<input required type="text" name="name" class="table-cell" placeholder="Project Name"> <br />');
        //Description
        form.append('<label for="description">Description</label>');
        form.append('<input required type="text" name="description" class="table-cell" placeholder="Project Description"> <br />');
        //Email
        form.append('<label for="email">Email</label>');
        form.append('<input type="text" name="email" class="table-cell" placeholder="name@email.com"> <br />');
        //Image
        form.append('<label for="image">Image</label>');
        form.append('<input type="text" name="image" class="table-cell" placeholder="url goes here"> <br />');

        form.append(submitButton);
        container.append(form);
        container.append('<div class="clear"></div>');
        submitButton.on('click', (event) => {
            event.preventDefault();
            createProject();
        });
    }

    function createProject() {
        const projectObject = {
            name: $('[name="name"]').val(),
            description: $('[name="description"]').val(),
            email: $('[name="email"]').val(),
            imageURL: $('[name="image"]').val(),
            comment: [],
            owner: "Owner Name", //TODO: find user's name
            worker: null,
        };
        console.log(projectObject);
        $.ajax({
            url: apiUrl,
            type: 'POST',
            dataType: 'JSON',
            data: projectObject,
            success: (data) => {
                if (data) {
                    window.location.href = 'projects.html';
                } else {
                    console.log("Error making project");
                }
            },
            error: (request, status, error) => {
                console.log("ERROROROR");
                console.log(error, status, request);
            }
        });
    }

    function displayAllProjects(projects) {
        let currentProjectDiv;
        if (projects) {
            currentProjectDiv = $("<div>").addClass("project");
            projects.forEach((project) => {
                console.log("Project:");
                console.log(project);
                let comments;
                if (project.comment) {
                    comments = [];
                    project.comment.forEach((comment) => {
                        comments.push(comment);
                    });
                } else {
                    comments = "No comments yet";
                }
                currentProjectDiv.append(
                    '<div class="cover-image">' +
                    '<img src="' + project.imageURL + '" alt="' + project.name + '"' +
                    'width="200px">' +
                    '</div>' +
                    '<p>' + project.description + '</p>' +
                    '<div>' +
                    '<h3>' + project.name + '</h3>' +
                    '<p> Posted By: ' + project.owner + '</p>' +
                    '<p>' + (project.worker || "Not claimed yet") + '</p>' +
                    '</div>' +
                    '<div class="clear"></div>'
                );
            });
        } else {
            currentProjectDiv.append('<div>No projects to display yet :(</div>');
        }
        $(".wrapper").append(currentProjectDiv);
    }

    $(document).ready(() => {
        $('#add-project').click(createAddProjectForm);
        getAllProjects();
    });
})();