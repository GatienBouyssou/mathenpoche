const activeClass = "active";

function changeElementToAdd() {
    $("#selectTypeElement option:selected").each(function () {
        $(".addElementPart").children().hide();
        $("." + $(this).val()).show();
    })
}

function buildBody(currentTarget) {
    let body = {};
    $(currentTarget.form).serializeArray().forEach(function (element) {
        body[element.name] = element.value;
    });
    body.levelName = $("#selectLevel option:selected")[0].value;
    body.typeElement = $("#selectTypeElement option:selected")[0].value;
    body.position = $("." + body.typeElement + " .selectionCollection .active")[0].id;
    return body;
}

$(document).ready(() => {
    changeElementToAdd();
    $("#selectTypeElement").change(() => {
       changeElementToAdd()
    });
    $("body").on("click", ".collection-item", (e) => {
        $(e.currentTarget.parentNode).children("." + activeClass).removeClass(activeClass);
        e.currentTarget.classList.add(activeClass);
    });

    $("input[type=submit]").click(function (e) {
        e.preventDefault();
        let body = buildBody($(this)[0]);

        let submitButton = $(this).parent();
        submitButton.addClass("disabled");

        let $feedBackList = $(".feedBackList");
        $feedBackList.empty();

        $.ajax({
            type:"POST",
            url: "/create",
            data: body
        }).done(function (result) {
            submitButton.removeClass("disabled");
            $(".addElementPart").html(result);
            changeElementToAdd();
        }).fail(function (error) {
            submitButton.removeClass("disabled");
            let errors = error.responseJSON.errors;
            for(let propertyName in errors) {
                $feedBackList.append("<li class='errorLabel'>"+ errors[propertyName] + "</li>");
            }
        })

    });

});

