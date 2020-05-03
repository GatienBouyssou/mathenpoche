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

// create the body of the request depending on the type of element to add
function buildBody(form, feedbackDiv, submitButton) {
    let formData = new FormData();
    $(form).serializeArray().forEach(function (element) {
        formData.append(element.name, element.value);
    });
    formData.append("typeElement", submitButton.dataset.type);
    formData.append("levelName", submitButton.dataset.level);
    formData.append("id", submitButton.dataset.id);

    if (formData.get("typeElement") === "lessons") {
        let fileInput = $("#fileUploader")[0];
        if (fileInput.files[0])
            formData.append("lessonFile", fileInput.files[0]);
    }
    return formData;
}

$(document).ready(() => {
    $("body").on("click", ".collection-item", (e) => {
        $(e.currentTarget.parentNode).children("." + activeClass).removeClass(activeClass);
        e.currentTarget.classList.add(activeClass);
    });

    $("body").on("click", ".btn", function (e) {
        e.preventDefault();
        console.log($(this))
        sendRequestEditElement($(this)[0].form, $(this))
    });

    function sendRequestEditElement(form, submitButton) {
        let $feedBackList = $(".feedBackList");
        $feedBackList.empty();

        let body = buildBody(form, $feedBackList, submitButton[0]);
        if (body) {
            submitButton.addClass("disabled");

            $.ajax({
                type:"PUT",
                url: "/edit",
                data: body,
                processData: false,
                contentType: false
            }).done(function (result) {
                submitButton.removeClass("disabled");
                window.location.href = window.location.origin + result;
                fileUploaded = null;
            }).fail(function (error) {
                submitButton.removeClass("disabled");
                let errors = error.responseJSON.errors;
                for(let propertyName in errors) {
                    $feedBackList.append("<li class='errorLabel'>"+ errors[propertyName] + "</li>");
                }
            })
        }

    }
});


