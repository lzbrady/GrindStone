(function () {
    "use strict";
    const apiUrl = "http://localhost:3000/jobs/";
    let allJobs;

    function getAllJobs() {
        $(".wrapper").empty();
        $.ajax({
            url: apiUrl,
            dataType: 'JSON',
            type: 'GET',
            success: (data) => {
                if (data) {
                    allJobs = data;
                    displayAllJobs(allJobs);
                } else {
                    displayAllJobs(null);
                }
            },
            error: (request, status, error) => {
                console.log("ERROR " + error);
            }
        });
    }

    function getSingleJobAndRedirect(job) {
        let error = false;
        try {
            const jobToSave = JSON.stringify(job);
            sessionStorage.setItem("singleJob", jobToSave);
        } catch (e) {
            error = true;
        }
        if (!error) {
            window.location.href = './detail-job.html';
        }
    }

    function createAddJobForm() {
        $(".wrapper").empty();
        const container = $("#add-job-div").empty();
        const form = $('<form name="create-job-form">');

        // Submit and cancel buttons
        const submitButton = $('<button id="create-job-btn" type="submit" class="table-cell"> Create Job </button>');
        const cancelButton = $('<button id="cancel-create-btn" type="submit" class="table-cell"> Cancel </button>');

        // Name
        form.append('<label for="name">Job Name</label>');
        form.append('<input required type="text" name="name" class="table-cell" placeholder="Job Name"> <br />');

        // Description
        form.append('<label for="description">Description</label>');
        form.append('<input required type="text" name="description" class="table-cell" placeholder="Job Description"> <br />');

        // Email
        form.append('<label for="email">Email</label>');
        form.append('<input type="text" name="email" class="table-cell" placeholder="name@email.com"> <br />');

        // Website
        form.append('<label for="email">Website</label>');
        form.append('<input type="text" name="email" class="table-cell" placeholder="www.grindstone.com"> <br />');

        // Phone
        form.append('<label for="email">Phone Number</label>');
        form.append('<input type="text" name="email" class="table-cell" placeholder="(123) 456-7890"> <br />');

        form.append(cancelButton);
        form.append(submitButton);
        container.append(form);
        container.append('<div class="clear"></div>');
        submitButton.on('click', (event) => {
            event.preventDefault();
            createJob();
        });
        cancelButton.on('click', (event) => {
            event.preventDefault();
            window.location.href = 'jobs.html';
        });
    }

    function createJob() {
        const jobObject = {
            name: $('[name="name"]').val(),
            description: $('[name="description"]').val(),
            email: $('[name="email"]').val(),
            comment: [],
            owner: "Owner Name", //TODO: find user's name
            worker: null,
        };
        $.ajax({
            url: apiUrl,
            type: 'POST',
            dataType: 'JSON',
            data: jobObject,
            success: (data) => {
                if (data) {
                    window.location.href = 'jobs.html';
                } else {
                    console.log("Error making job");
                }
            },
            error: (request, status, error) => {
                console.log(error, status, request);
            }
        });
    }

    function displayAllJobs(jobs) {
        let currentJobDiv;
        if (jobs) {
            jobs.forEach((job) => {
                currentJobDiv = $("<div>").addClass("job");
                currentJobDiv.on('click', () => {
                    getSingleJobAndRedirect(job);
                });
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
            });
        } else {
            currentJobDiv = $("<div>").addClass("job");
            currentJobDiv.append('<p>No jobs to display yet :(</p>');
        }
    }

    $(document).ready(() => {
        $('#add-job').click(createAddJobForm);
        getAllJobs();
    });
})();