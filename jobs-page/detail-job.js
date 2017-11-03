(() => {
    "user strict";
    let job = {};
    const apiUrl = "http://localhost:3000/jobs/";

    function loadJob() {
        let jobString, error = false;
        try {
            jobString = sessionStorage.getItem("singleJob");
        } catch (e) {
            error = true;
            window.location = "jobs.html";
        }
        if (!error) {
            job._id = JSON.parse(jobString)._id;
            getJobById();
        }
    }

    function getJobById() {
        $.ajax({
            url: apiUrl + job._id,
            type: "GET",
            dataType: "JSON",
            success: (data) => {
                if (data) {
                    job = data;
                    displayJob();
                } else {
                    console.log("Job Not Found");
                }
            },
            error: (request, status, error) => {
                console.log(error, status, request);
            }
        });
    }

    function displayJob() {
        const currentJobDiv = $("<div>").addClass("job");
        let comments;
        if (job.comment) {
            comments = [];
            job.comment.forEach((comment) => {
                comments.push(comment);
            });
        } else {
            comments = "No comments yet";
        }
        currentJobDiv.append(
            '<h1 class="job-name">' + job.name + '</h1>' +
            '<div>' +
            '<p class="description">' + job.description + '</p>' +
            '<p> Posted By: ' + job.owner + '</p>' +
            '<p> Claimed By: ' + (job.worker || "Not claimed yet") + '</p>' +
            '</div>'
        );
        $(".wrapper").append(currentJobDiv);
        setHeights();
    }

    function setHeights() {
        $('.job-info-btn').height(
            5 + $('.job').height() / 4
        );
        $('.job-info-content').height(
            5 + $('.job').height() / 4
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

        loadJob();
    });
})();