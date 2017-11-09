(function () {
    "use strict";
    const apiUrl = "http://localhost:3000/profile/";
    let thisUser = {};

    function loadUser() {
        let userString, error = false;
        try {
            userString = sessionStorage.getItem("singleUser");
        } catch (e) {
            error = true;
            window.location.href = "../login/login.html";
        }
        if (!error) {
            thisUser.username = JSON.parse(userString).username;
            getUser();
        }
    }

    function getUser() {
        $.ajax({
            url: apiUrl + thisUser.username,
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
                console.log("Error: ", error, status, request);
            }
        });
    }

    function addSkill() {
        const skill = {
            skill: $('[name="skill"]').val()
        };

        $.ajax({
            url: apiUrl + thisUser.username,
            type: "POST",
            dataType: "JSON",
            data: skill,
            success: (data) => {
                thisUser = data;
                displayUser();
            },
            error: (request, status, error) => {
                console.log("Error: ", error, status, request);
            }
        });
    }

    function addReview() {
        const review = {
            rating: $('[name="rating"]').val(),
            description: $('[name="description"]').val(),
        };

        $.ajax({
            url: apiUrl + thisUser.username,
            type: "POST",
            dataType: "JSON",
            data: review,
            success: (data) => {
                console.log(data);
                thisUser = data;
                displayUser();
            },
            error: (request, status, error) => {
                console.log("Error: ", error, status, request);
            }
        });
    }

    function loadSkills() {
        if ($('.skill-ul')) {
            $('.skill-ul').empty();
        }

        const skills = $('<div>').addClass('skills');
        skills.append('<h3 id="skills-heading">Skills</h3>' +
            '<input type="text" name="skill" id="skill-input">' +
            '<div class="fab">+</div>');

        if (thisUser.skillList && thisUser.skillList != []) {
            skills.append('<ul class="skill-ul">');
            for (let i = 0; i < thisUser.skillList.length; i++) {
                skills.append('<li>' + thisUser.skillList[i] + '</li>');
            }
            skills.append('</ul>');
        }
        $('.container').append(skills);
    }

    function displayUser() {
        if (thisUser.username) {
            $('.container').empty();

            // Skills
            loadSkills();

            // Bio
            const rightPane = $('<div>').addClass('right-pane');
            const info = $('<div>').addClass('profile-info');
            info.append('<h1>' + thisUser.username + '</h1>' +
                '<p><strong>Bio: </strong>' + (thisUser.bio || "No bio yet") + '</p></div>');
            rightPane.append(info);

            // Reviews
            const reviews = $('<div>').addClass('reviews');
            reviews.append('<h3>Reviews</h3>');

            if (thisUser.reviews && thisUser.reviews != []) {
                for (let i = 0; i < thisUser.reviews.length; i++) {
                    reviews.append('<div class="review">' +
                        '<span class="rating">' + thisUser.reviews[i].rating + '</span>' +
                        '<span class="rating-description">' + thisUser.reviews[i].description + '</span>' +
                        '<br><a class="reviewer" href="">- ' + thisUser.reviews[i].reviewer + '</a><hr></div>');
                }
            }
            reviews.append('<input type="text" name="rating">' +
                '<input type="text" name="description">' +
                '<button id="save-review">Post</button>');
            rightPane.append(reviews);
            $('.container').append(rightPane);
        } else {
            const msg = $('<div>');
            msg.append('You have to create an account or log in to view your profile!');
            $('.container').append(msg);
        }

        $('.fab').click((event) => {
            event.preventDefault();
            addSkill();
        });
        $('#save-review').click((event) => {
            event.preventDefault();
            addReview();
        });
    }

    $(document).ready(function () {
        loadUser();
    });
})();