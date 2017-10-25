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
            let contents = $('.job-info-content');
            for (let i = 0; i < contents.length; i++) {
                $(contents[i]).hide();
            }
            $(this).next().show();
        }
    });

    function getComments() {
        let comments = $('.comments');
        let handle = $('.comment-handle');
        let oneComment = $('.comment');

        handle.text('username');
        oneComment.text('This is the text of a comment. Phasellus convallis sit amet nisi ac cursus. Vestibulum sit amet ligula lacus. Integer faucibus augue ut tempor cursus. Proin tortor tortor, cursus quis porta ac, mollis non justo.')
    }

    getComments();
});