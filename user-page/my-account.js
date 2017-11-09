(function () {
    "use strict";
    const apiUrl = "http://localhost:3000/profile/";
    let thisUser = {};

    function loadUser() {
        let userString, error = false;
        try {
            userString = sessionStorage.getItem("singleUSer");
        } catch (e) {
            error = true;
            window.location = "../login/login.html";
        }
        if (!error) {
            thisUser._id = JSON.parse(userString)._id;
            getUser();
        }
    }

    function getUser() {
        $.ajax({
            url: apiUrl + thisUser._id,
            type: "GET",
            dataType: "JSON",
            success: (data) => {
                if (data) {
                    thisUser = data;
                    displayUser();
                } else {
                    console.log("User Not Found");
                }
            },
            error: (request, status, error) => {
                console.log(error, status, request);
            }
        });
    }

    function displayUser() {
        const rightPane = $('<div>').addClass('right-pane');
        const info = $('<div>').addClass('profile-info');
        info.append('<h1>' + thisUser.username + '</h1>' +
            '<p><strong>Bio: </strong>' + thisUser.bio + '</p></div>');
        rightPane.append(info);
        $('.container').append(rightPane);
    }

    $(document).ready(function () {
        loadUser();
    });
})();