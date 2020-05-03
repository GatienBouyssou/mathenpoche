let fileUploaded;
$(document).ready(() => {

    $("body").on("change", "#fileUploader", function () {
        previewFile($("#fileUploader")[0].files[0])
    });

    $("body").on("drop", "#fileUploaderDiv", function (e) {
        e.preventDefault();
        previewFile(e.originalEvent.dataTransfer.files[0]);
    });
    $("body").on("dragover", "#fileUploaderDiv", function(e) {
        e.preventDefault();
    });

    $("body").on("drag", "#fileUploaderDiv", function(e){
        console.log(e)
        e.originalEvent.dataTransfer.setData("", e.target.prototype.id)
    });

    /*make the div change when the user drag something into the box*/
    $("body").on("dragenter", "#fileUploaderDiv", function (e) {
        $("#fileUploaderDiv").removeClass().addClass("redDashedBorder");
        showALabel("#duringUpload")
    });

    /*show a label depending on his id*/
    function showALabel(id) {
        $("#informationLabels").children("span").hide();
        $(id).show();
    }


    function setNormalTemplate() {
        $("#fileUploaderDiv").removeClass().addClass("greyDashedBorder");
        showALabel("#labelUpload")
    }

    $("body").on("dragleave", "#fileUploaderDiv", function () {
        setNormalTemplate();
    });


    /*this method import a file into the browser and display an error if needed*/
    function previewFile(file) {
        if (file === undefined)
            file = null;
        if(isNaN(file)){
            if (file.type === "application/pdf"){
                fileUploaded = file;
                $(".fileSelected").text("File selected : " + file.name);
                $(".fileSelected").show();
                $("#duringUpload").hide()
            } else {
                showALabel("#errorUpload")
            }
        }
        $("#fileUploaderDiv").removeClass().addClass("greyDashedBorder");
    }
});





