(function () {
    const apiUrl = "http://localhost:3000/";

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
                    }
                    console.log(data);
                },
                error: (request, status, error) => {
                    console.log("ERROR");
                }
            });
        } else {
            $('#password-error').show();
        }
    }

    function login() {
        const user = {
            username: $('[name="username-login"]').val(),
            password: $('[name="password-login"]').val()
        };

        $.ajax({
            url: apiUrl + "login",
            type: "POST",
            dataType: "JSON",
            data: user,
            success: (data) => {
                if (data) {
                    console.log(data);
                } else {
                    console.log("No match");
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