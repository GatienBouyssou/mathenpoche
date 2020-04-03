$(document).ready(() => {

    $("#loginContainer .hiddenSection").hide();

    $(".activeLink").css("color", "red");

    $("#signupLink").on("click", (e) => {
        animationOutIn($("#signInForm"), $("#signUpForm"), $("#loginLink"), $("#signupLink"));
    });

    $("#loginLink").on("click", (e) => {
        animationOutIn($("#signUpForm"), $("#signInForm"), $("#signupLink"), $("#loginLink"));
    });

    function animationOutIn(toHide, toShow, linkToNormal, linkHighlighted) {
        $("#loginContainer").fadeOut("slow", ()=>{
            toHide.hide();
            toShow.show();
            linkToNormal.css("color", "black");
            linkHighlighted.css("color", "red");
            $("#loginContainer").fadeIn("slow")
        })
    };

});


