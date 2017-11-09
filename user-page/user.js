(function () {
    "use strict";
    const apiUrl = "http://localhost:3000/users/";
    let allUsers;

    // For testing
    // let allUsers = [
    //     {username: "huangf1", email: "a@b.com"},
    //     {username: "huangf2", email: "c@b.com"}
    // ];

    function getAllUsers() {
        $(".wrapper").empty();
        $.ajax({
            url: apiUrl,
            dataType: 'JSON',
            type: 'GET',
            success: (data) => {
                if (data) {
                    allUsers = data;
                    displayAllUsers(allUsers);
                } else {
                    displayAllUsers(null);
                }
            },
            error: (request, status, error) => {
                console.log("ERROR " + error);
            }
        });

        // displayAllUsers(allUsers);
    }

    function getSingleUserAndRedirect(user) {
        let error = false;
        try {
            const userToSave = JSON.stringify(user);
            sessionStorage.setItem("singleUser", userToSave);
        } catch (e) {
            error = true;
        }
        if (!error) {
            window.location.href = './my-account.html';
        }
    }

    // function createAddUserForm() {
    //     $(".wrapper").empty();
    //     const container = $("#add-user-div").empty();
    //     const form = $('<form name="create-project-form">');

    //     // Submit and cancel buttons
    //     const submitButton = $('<button id="create-project-btn" type="submit" class="table-cell"> Create Project </button>');
    //     const cancelButton = $('<button id="cancel-create-btn" type="submit" class="table-cell"> Cancel </button>');

    //     // Name
    //     form.append('<label for="name">Project Name</label>');
    //     form.append('<input required type="text" name="name" class="table-cell" placeholder="Project Name"> <br />');

    //     // Description
    //     form.append('<label for="description">Description</label>');
    //     form.append('<input required type="text" name="description" class="table-cell" placeholder="Project Description"> <br />');

    //     // Email
    //     form.append('<label for="email">Email</label>');
    //     form.append('<input type="text" name="email" class="table-cell" placeholder="name@email.com"> <br />');

    //     form.append(cancelButton);
    //     form.append(submitButton);
    //     container.append(form);
    //     container.append('<div class="clear"></div>');
    //     submitButton.on('click', (event) => {
    //         event.preventDefault();
    //         createProject();
    //     });
    //     cancelButton.on('click', (event) => {
    //         event.preventDefault();
    //         window.location.href = 'projects.html';
    //     });
    // }

    // function createProject() {
    //     const projectObject = {
    //         name: $('[name="name"]').val(),
    //         description: $('[name="description"]').val(),
    //         email: $('[name="email"]').val(),
    //         comments: [],
    //         owner: "Owner Name", //TODO: find user's name
    //         worker: null,
    //     };
    //     $.ajax({
    //         url: apiUrl,
    //         type: 'POST',
    //         dataType: 'JSON',
    //         data: projectObject,
    //         success: (data) => {
    //             if (data) {
    //                 window.location.href = 'projects.html';
    //             } else {
    //                 console.log("Error making project");
    //             }
    //         },
    //         error: (request, status, error) => {
    //             console.log(error, status, request);
    //         }
    //     });
    // }
    
    function displayAllUsers(users) {
        let currentUserDiv;
        if (users) {
            users.forEach((user) => {
                console.log("user!!!");
                currentUserDiv = $("<div>").addClass("user");
                currentUserDiv.on('click', () => {
                    getSingleUserAndRedirect(user);
                });
                // let comments;
                // if (project.comment) {
                //     comments = [];
                //     project.comment.forEach((comment) => {
                //         comments.push(comment);
                //     });
                // } else {
                //     comments = "No comments yet";
                // }
                currentUserDiv.append(
                    // '<h1 class="user-name">' + user.username + '</h1>' +
                    // '<div>' +
                    // '<p class="email">' + user.email + '</p>' +
                    // '</div>'
                    '<li class="user-card">' + 
                    '<!-- link to user detail page -->' +
                    '<a href="">' +
                        '<!-- picture -->' +
                        '<img class="user-image" src="../images/user-icon-image-placeholder.jpg" alt="">' + 
                    '</a>' +
                    '<div class="user-detail">' +
                        '<!-- link to user detail page -->' +
                        '<a href="">' + user.username + '</a>' +
                        '<!-- user email -->' +
                        '<p class="user-email">' + user.email + '</p>' +
                    '</div>' +
                    '<div class="user-stats">' +
                        '<p>Projects: </p>' +
                        '<strong>12</strong>' +
                        '<p>Follers: </p>' +
                        '<strong>100</strong>' +
                    '</div>' +
                    '</li>'
                );
                $(".wrapper").append(currentUserDiv);
            });
        } else {
            currentUserDiv = $("<div>").addClass("user");
            currentUserDiv.append('<p>No users to display yet :(</p>');
        }
    }

    $(document).ready(() => {
        getAllUsers();
    });
})();