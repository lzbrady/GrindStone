(() => {
    "user strict";
    let project = {};
    const apiUrl = "https://grindstone-app-api-username.herokuapp.com/projects/";
    // const apiUrl = "http://localhost:3000/projects/";

    function loadProject() {
        let projectString, error = false;
        try {
            projectString = sessionStorage.getItem("singleProject");
        } catch (e) {
            error = true;
            window.location = "projects.html";
        }
        if (!error) {
            project._id = JSON.parse(projectString)._id;
            getProjectById();
        }
    }

    function comment() {
        const comment = {
            name: 'Temp-Name',
            comment: $('[name="comment"]').val()
        };
        $.ajax({
            url: apiUrl + project._id,
            type: "POST",
            data: comment,
            dataType: "JSON",
            success: (data) => {
                if (data) {
                    console.log(data);
                    project = data;
                    displayComments();
                } else {
                    console.log("Could not post comment");
                }
            },
            error: (request, status, error) => {
                console.log(error, status, request);
            }
        });
    }

    function getProjectById() {
        $.ajax({
            url: apiUrl + project._id,
            type: "GET",
            dataType: "JSON",
            success: (data) => {
                if (data) {
                    project = data;
                    displayProject();
                } else {
                    console.log("Project Not Found");
                }
            },
            error: (request, status, error) => {
                console.log(error, status, request);
            }
        });
    }

    function displayProject() {
        const currentProjectDiv = $("<div>").addClass("project");
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
            '<h1 class="project-name">' + project.name + '</h1>' +
            '<div>' +
            '<p class="description">' + project.description + '</p>' +
            '<p> Posted By: ' + project.owner + '</p>' +
            '</div>'
        );
        $(".wrapper").append(currentProjectDiv);
        setHeights();

        // Comment handler
        $('#input-comment-btn').click((e) => {
            e.preventDefault();
            comment();
        });

        displayComments();
        $('#myAccount').click((event) => {
            event.preventDefault();
            loadMyAccount();
        });
    }

    function loadMyAccount() {
        sessionStorage.setItem("isMyAccount", "true");
        window.location.href="../user-page/my-account.html";
    }

    function setHeights() {
        $('.job-info-btn').height(
            5 + $('.project').height() / 4
        );
        $('.job-info-content').height(
            5 + $('.project').height() / 4
        );
    }

    function displayComments() {
        $('#input-comment').val('');
        $('.comments').empty();
        let length = 0;
        if (project.comments) {
            length = project.comments.length;
        }
        for(let i = 0; i < length; i++) {
            const comment = project.comments[i];
            const oneComment = $('<div>');
            oneComment.append(
                '<div id="at">@</div>' +
                '<div class="comment-handle">' + comment.name + '</div>' + 
                '<div class="comment">' + comment.comment + '</div>'
            );
            $('.comments').append(oneComment);
        }
        if (length == 0) {
            $('.comments').append('<p>No Comments Yet</p>');
        }
    }

    $(document).ready(function () {
        loadProject();
    });
})();