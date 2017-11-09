(function () {
    const apiUrl = "https://grindstone-app-api-username.herokuapp.com/";

    function register() {
        $('#password-error').hide();
        $('#username-error').hide();
        $('#email-error').hide();

        const pass = $('[name="password"]').val();
        const confirm = $('[name="confirm"]').val();

        if (pass === confirm) {
            const user = {
                username: $('[name="username"]').val(),
                email: $('[name="email"]').val(),
                password: pass
            };
            $.ajax({
                url: apiUrl + "register",
                type: "POST",
                dataType: "JSON",
                data: user,
                success: (data) => {
                    if (data == "Username Taken") {
                        $('#username-error').show();
                    } else if (data == "Email taken") {
                        $('#email-error').show();
                    } else {
                        const user = {
                            username: $('[name="username"]').val(),
                            password: pass
                        };
                        login(user);
                    }
                },
                error: (request, status, error) => {
                    console.log("ERROR");
                }
            });
        } else {
            $('#password-error').show();
        }
    }

    function getSingleUserAndRedirect(user) {
        let error = false;
        try {
            const userToSave = JSON.stringify(user);
            console.log(userToSave);
            sessionStorage.setItem("singleUser", userToSave);
            sessionStorage.setItem("isMyAccount", "true");
        } catch (e) {
            error = true;
        }
        if (!error) {
            window.location.href = '../user-page/my-account.html';
        }
    }

    function login(u) {
        $('#invalid-cred').hide();
        const user = u || {
            username: $('[name="username-login"]').val(),
            password: $('[name="password-login"]').val()
        };

        $.ajax({
            url: apiUrl + "login",
            type: "POST",
            dataType: "JSON",
            data: user,
            success: (data) => {
                if (data && data.success) {
                    getSingleUserAndRedirect(data.user);
                } else {
                    console.log("No match");
                    $('#invalid-cred').show();
                }
            },
            error: (request, status, error) => {
                console.log("Failure");
                console.log("ERROR " + error);
            }
        });
    }

    $(document).ready(() => {
        $(".register-btn").click((event) => {
            event.preventDefault();
            register();
        });

        $("#login-btn").click((event) => {
            event.preventDefault();
            login();
        });
    });
})();