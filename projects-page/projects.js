(function () {
    "use strict";
    const apiUrl = "http://localhost:3000/projects/";
    let allProjects;

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

    $(document).ready(() => {
        $('#add-project').click(createAddProjectForm);
    });
})();