(() => {
    "user strict";
    let project = {};
    const apiUrl = "http://localhost:3000/projects/";

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
            '<p> Claimed By: ' + (project.worker || "Not claimed yet") + '</p>' +
            '</div>'
        );
        $(".wrapper").append(currentProjectDiv);
        setHeights();
    }

    function setHeights() {
        $('.job-info-btn').height(
            5 + $('.project').height() / 4
        );
        $('.job-info-content').height(
            5 + $('.project').height() / 4
        );
    }

    function getComments() {
        let comments = $('.comments');
        const handle = $('.comment-handle');
        const oneComment = $('.comment');

        handle.text('username');
        oneComment.text('This is the text of a comment. Phasellus convallis sit amet nisi ac cursus. Vestibulum sit amet ligula lacus. Integer faucibus augue ut tempor cursus. Proin tortor tortor, cursus quis porta ac, mollis non justo.')
    }

    $(document).ready(function () {
        //Display first job info div on start
        $($('.job-info-content')[0]).show();

        //Toggling job info divs
        $('.job-info-btn').click(function () {
            //First check to see if clicking on already displayed element, if so close it and don't display anythign else
            if (this.nextElementSibling.style.display == 'block') {
                $(this).next().hide();
            } else {
                //Hide the rest of them
                const contents = $('.job-info-content');
                for (let i = 0; i < contents.length; i++) {
                    $(contents[i]).hide();
                }
                $(this).next().show();
            }
        });

        loadProject();
    });
})();