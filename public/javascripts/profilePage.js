$(document).ready(() => {
    $( "#profileForm" ).on( "submit", function( event ) {
        event.preventDefault();
        $('#submitButtonSignup').parent().addClass("disabled");
        let body = {};
        $(this).serializeArray().forEach(function (element) {
            body[element.name] = element.value;
        });
        $.ajax({
            url: "/profile",
            type: "POST",
            data: body
        }).done(function(response) {
            $('#submitButtonSignup').parent().removeClass("disabled");
            console.log(response)
            $("#passwordSignup").val("");
            $("#passwordConfirm").val("");
            M.toast({html: "<span>Your profile have been successfully updated.</span>"})

        }).fail(function (error) {
            $('#submitButtonSignup').parent().removeClass("disabled");
            let errors = error.responseJSON.errors;
            for (const property in errors) {
                $("input[name='"+property+"']").removeClass("valid").addClass("invalid");
                $("#"+property+"Error").attr("data-error", errors[property]);
            }
            M.toast({html: error.responseJSON.message})
        })
    });
});

