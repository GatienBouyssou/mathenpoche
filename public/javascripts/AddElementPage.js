const activeClass = "active";
const preloader = "\n" +
    "  <div class=\"preloader-wrapper big active\">\n" +
    "    <div class=\"spinner-layer spinner-blue-only\">\n" +
    "      <div class=\"circle-clipper left\">\n" +
    "        <div class=\"circle\"></div>\n" +
    "      </div><div class=\"gap-patch\">\n" +
    "        <div class=\"circle\"></div>\n" +
    "      </div><div class=\"circle-clipper right\">\n" +
    "        <div class=\"circle\"></div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>";

function changeElementToAdd() {
    $("#selectTypeElement option:selected").each(function () {
        $(".addElementPart").children().hide();
        $("." + $(this).val()).show();
    })
}

// create the body of the request depending on the type of element to add
function buildBody(form, feedbackDiv) {
    let formData = new FormData();
    $(form).serializeArray().forEach(function (element) {
        formData.append(element.name, element.value);
    });

    formData.append("levelName", $("#selectLevel option:selected")[0].value);
    formData.append("typeElement", $("#selectTypeElement option:selected")[0].value);

    switch (formData.get("typeElement")) {
        case "chapter":
            formData.append("position", $("." + formData.get("typeElement") + " .selectionCollection .active")[0].id);
            break;
        case "lesson":
            let chapterSelected = $("." + formData.get("typeElement") + " .selectionCollection").children(".active");
            if (chapterSelected.length === 0) {
                feedbackDiv.append("<li class='errorLabel'>You need to select a chapter</li>");
                return null;
            }
            formData.append("chapterId", chapterSelected[0].childNodes[1].id);

            if (fileUploaded)
                formData.append("lessonFile", fileUploaded);
            else {
                feedbackDiv.append("<li class='errorLabel'>You need to select a file</li>");
                return null;
            }

            try {
                formData.append("position", chapterSelected.find(".collapsible-body .active")[0].id);
            } catch (e) {
                formData.append("position", "");
            }
            break;
        case "exercise":
            break;
    }
    return formData;
}

$(document).ready(() => {
    changeElementToAdd();
    $("#selectLevel").change(() => {
        let $feedBackList = $(".feedBackList");
        $feedBackList.empty();
        $(".addElementPart").html(preloader);
        $.ajax({
            type:"GET",
            url: "/levelInfo/"+$("#selectLevel option:selected")[0].value,
            processData: false,
            contentType: false
        }).done(function (result) {
            $(".addElementPart").html(result);
            changeElementToAdd();
            materializeInit();
        }).fail(function (error) {
            let errors = error.responseJSON.errors;
            for(let propertyName in errors) {
                $feedBackList.append("<li class='errorLabel'>"+ errors[propertyName] + "</li>");
            }
        })
    });

    $("#selectTypeElement").change(() => {
       changeElementToAdd()
    });
    $("body").on("click", ".collection-item", (e) => {
        $(e.currentTarget.parentNode).children("." + activeClass).removeClass(activeClass);
        e.currentTarget.classList.add(activeClass);
    });

    $("body").on("click", ".btn", function (e) {
        e.preventDefault();
        sendRequestCreateElement($(this)[0].form, $(this))
    });

    function sendRequestCreateElement(form, submitButton) {
        let $feedBackList = $(".feedBackList");
        $feedBackList.empty();

        let body = buildBody(form, $feedBackList);
        if (body) {
            submitButton.addClass("disabled");
            $.ajax({
                type:"POST",
                url: "/create",
                data: body,
                processData: false,
                contentType: false
            }).done(function (result) {
                submitButton.removeClass("disabled");
                $(".addElementPart").html(result);
                changeElementToAdd();
                materializeInit();
                fileUploaded = null;
            }).fail(function (error) {
                console.log(error)
                submitButton.removeClass("disabled");
                let errors = error.responseJSON.errors;
                for(let propertyName in errors) {
                    $feedBackList.append("<li class='errorLabel'>"+ errors[propertyName] + "</li>");
                }
            })
        }

    }
});


