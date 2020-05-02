$(document).ready(function () {
    $("#search").change(function (e) {
        console.log(e.currentTarget.value)
    });

    $(".editIcon").click(function (e) {

    });

    $(".deleteIcon").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        let chapterItem = $($(this).parents("li")[0]);
        chapterItem.hide();
        $.ajax({
            type: "DELETE",
            url: e.target.parentNode.attributes[0].nodeValue,
        }).done(function (result) {
            chapterItem.remove();
        }).fail(function (error) {
            chapterItem.show();
            M.toast({html: error.responseJSON.errors.message, displayLength: 5000})
        });
    });
});


