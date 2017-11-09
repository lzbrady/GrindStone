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

        $('#email').text(job.email);
        $('#deadline').text(job.deadline || "No Deadline Specified");
        $('#phone').text(job.phone || "No Phone Number Given");

        // Comment handler
        $('#input-comment-btn').click((e) => {
            e.preventDefault();
            comment();
        });

        displayComments();
    }

    function comment() {
        const comment = {
            name: 'Temp-Name',
            comment: $('[name="comment"]').val()
        };
        $.ajax({
            url: apiUrl + job._id,
            type: "POST",
            data: comment,
            dataType: "JSON",
            success: (data) => {
                if (data) {
                    console.log(data);
                    job = data;
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

    function setHeights() {
        $('.job-info-btn').height(
            5 + $('.job').height() / 4
        );
        $('.job-info-content').height(
            5 + $('.job').height() / 4
        );
    }

    function displayComments() {
        $('#input-comment').val('');
        $('.comments').empty();
        let length = 0;
        if (job.comments) {
            length = job.comments.length;
        }
        for (let i = 0; i < length; i++) {
            const comment = job.comments[i];
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