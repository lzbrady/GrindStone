(function () {
    "use strict";
    // const apiUrl = "https://grindstone-app-api-username.herokuapp.com/user";
    const apiUrl = "http://localhost:3000/users/";
    let allUsers;

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
    }

    function getSingleUserAndRedirect(user) {
        let error = false;
        console.log(user);
        try {
            const userToSave = JSON.stringify(user);
            sessionStorage.setItem("singleUser", userToSave);
            sessionStorage.setItem("isMyAccount", "false");
        } catch (e) {
            error = true;
        }
        if (!error) {
            window.location.href = 'my-account.html';
        }
    }

    function displayAllUsers(users) {
        let currentUserDiv;
        if (users) {
            users.forEach((user) => {
                currentUserDiv = $("<div>").addClass("user");
                currentUserDiv.on('click', () => {
                    getSingleUserAndRedirect(user);
                });
                currentUserDiv.append(
                    '<li class="user-card">' +
                    '<!-- link to user detail page -->' +
                    '<div class="user-detail">' +
                    '<!-- link to user detail page -->' +
                    '<h1 id="username">' + user.username + '</h1>' +
                    '<!-- user email -->' +
                    '<p class="user-email">' + user.email + '</p>' +
                    '</div>' +
                    '<div class="user-stats"><strong>Skills:');

                if (user.skillList) {
                    for (let i = 0; i < user.skillList.length; i++) {
                        currentUserDiv.append('<div class="one-skill">'+ user.skillList[i] + '</div>');
                    }
                }

                currentUserDiv.append('</strong></div>' +
                    '</li>');
                $(".wrapper").append(currentUserDiv);
            });
        } else {
            currentUserDiv = $("<div>").addClass("user");
            currentUserDiv.append('<p>No users to display yet :(</p>');
        }
        $('#myAccount').click((event) => {
            event.preventDefault();
            loadMyAccount();
        });
    }

    function loadMyAccount() {
        sessionStorage.setItem("isMyAccount", "true");
        window.location.href = "../user-page/my-account.html";
    }

    $(document).ready(() => {
        getAllUsers();
    });
})();