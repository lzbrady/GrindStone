(function () {
    "use strict";
    const apiUrl = "https://grindstone-app-api-username.herokuapp.com/projects";
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
        });
    }

    function getSingleProjectAndRedirect(project) {
        let error = false;
        try {
            const projectToSave = JSON.stringify(project);
            sessionStorage.setItem("singleProject", projectToSave);
        } catch (e) {
            error = true;
        }
        if (!error) {
            window.location.href = './detail-project.html';
        }
    }

    function createAddProjectForm() {
        $(".wrapper").empty();
        const container = $("#add-project-div").empty();
        const form = $('<form name="create-project-form">');

        // Submit and cancel buttons
        const submitButton = $('<button id="create-project-btn" type="submit" class="table-cell"> Create Project </button>');
        const cancelButton = $('<button id="cancel-create-btn" type="submit" class="table-cell"> Cancel </button>');

        // Name
        form.append('<label for="name">Project Name</label>');
        form.append('<input required type="text" name="name" class="table-cell" placeholder="Project Name"> <br />');

        // Description
        form.append('<label for="description">Description</label>');
        form.append('<input required type="text" name="description" class="table-cell" placeholder="Project Description"> <br />');

        // Email
        form.append('<label for="email">Email</label>');
        form.append('<input type="text" name="email" class="table-cell" placeholder="name@email.com"> <br />');

        form.append(cancelButton);
        form.append(submitButton);
        container.append(form);
        container.append('<div class="clear"></div>');
        submitButton.on('click', (event) => {
            event.preventDefault();
            createProject();
        });
        cancelButton.on('click', (event) => {
            event.preventDefault();
            window.location.href = 'projects.html';
        });
    }

    function createProject() {
        const projectObject = {
            name: $('[name="name"]').val(),
            description: $('[name="description"]').val(),
            email: $('[name="email"]').val(),
            comments: [],
            owner: "Owner Name", //TODO: find user's name
            worker: null,
        };
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
                console.log(error, status, request);
            }
        });
    }

    function displayAllProjects(projects) {
        let currentProjectDiv, areProjects = true;

        if (projects.message) {
            if (!projects.success) {
                areProjects = false;
                console.log(projects);
            }
        }

        if (projects && areProjects) {
            projects.reverse().forEach((project) => {
                currentProjectDiv = $("<div>").addClass("project");
                currentProjectDiv.on('click', () => {
                    getSingleProjectAndRedirect(project);
                });

                currentProjectDiv.append(
                    '<h1 class="project-name">' + project.name + '</h1>' +
                    '<div>' +
                    '<p class="description">' + project.description + '</p>' +
                    '<p> Posted By: ' + project.owner + '</p>' +
                    '<p> Claimed By: ' + (project.worker || "Not claimed yet") + '</p>' +
                    '</div>'
                );
                $(".wrapper").append(currentProjectDiv);
            });
        } else {
            currentProjectDiv = $("<div>").addClass("project");
            currentProjectDiv.append('<p>No projects to display yet :(</p>');
        }
    }

    $(document).ready(() => {
        $('#add-project').click(createAddProjectForm);
        getAllProjects();
    });
})();