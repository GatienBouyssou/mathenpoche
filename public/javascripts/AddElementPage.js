const activeClass = "active";

function changeElementToAdd() {
    $("#selectTypeElement option:selected").each(function () {
        $(".addElementPart").children().hide();
        $("." + $(this).val()).show();
    })
}

$(document).ready(() => {
    changeElementToAdd();
    $("#selectTypeElement").change(() => {
       changeElementToAdd()
    });
    $(".collection-item").on("click", (e) => {
        $(e.currentTarget.parentNode).children("." + activeClass).removeClass(activeClass);
        e.currentTarget.classList.add(activeClass);

    });

});

