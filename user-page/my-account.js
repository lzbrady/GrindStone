(function () {
    "use strict";
    const apiUrl = "http://localhost:3000/profile/";
    let thisUser = {},
        isMyAccount = {};

    function loadUser() {
        let userString, error = false;

        try {
            isMyAccount = {
                isMyAccount: sessionStorage.getItem("isMyAccount")
            };
        } catch (e) {
            isMyAccount = {
                isMyAccount: "true"
            };
        }

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
            data: isMyAccount,
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
        if ($('[name="skill"]').val() != '') {
            const skill = {
                skill: $('[name="skill"]').val()
            };

            $('[name="skill"]').val('');

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
    }

    function addReview() {
        if ($('[name="rating"]').val() != '' && $('[name="description"]').val() != '') {
            const review = {
                rating: $('[name="rating"]').val(),
                description: $('[name="description"]').val(),
            };

            $('[name="rating"]').val('');
            $('[name="description"]').val('');

            $.ajax({
                url: apiUrl + thisUser.username,
                type: "POST",
                dataType: "JSON",
                data: review,
                success: (data) => {
                    thisUser = data;
                    displayUser();
                },
                error: (request, status, error) => {
                    console.log("Error: ", error, status, request);
                }
            });
        }
    }

    function loadSkills() {
        if ($('.skill-ul')) {
            $('.skill-ul').empty();
        }

        const skills = $('<div>').addClass('skills');
        skills.append('<input type="text" name="skill" id="skill-input">' +
            '<div class="fab">Add</div>' +
            '<h3 id="skills-heading">Skills</h3><hr id="skills-hr">');

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
                        '<br><p class="reviewer">- ' + thisUser.reviews[i].reviewer + '</p><hr></div>');
                }
            }
            reviews.append('<input id="review-rating" type="text" name="rating" placeholder="1-5"> <strong>/ 5</strong>' +
                '<input id="review-description" type="text" name="description" placeholder="Please tell us why you left this rating">' +
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
        $('#myAccount').click((event) => {
            event.preventDefault();
            loadMyAccount();
        });
    }

    function loadMyAccount() {
        sessionStorage.setItem("isMyAccount", "true");
        window.location.href = "../user-page/my-account.html";
    }

    $(document).ready(function () {
        loadUser();
    });
})();