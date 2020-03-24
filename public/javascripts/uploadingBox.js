$(document).ready(() => {
    let fileUploader = $("#fileUploader");
    let fileUploaderDiv = $("#fileUploaderDiv");
    let info = $("#informationLabels");

    fileUploader.change(function () {
        previewFile(fileUploader[0].files[0])
    });

    fileUploaderDiv.on("drop", function (e) {
        e.preventDefault();
        previewFile(e.originalEvent.dataTransfer.files[0]);
    });
    fileUploaderDiv.on( "dragover", function(e) {
        e.preventDefault();
    });

    fileUploaderDiv.on("drag", function(e){
        e.originalEvent.dataTransfer.setData("", e.target.prototype.id)
    });

    /*make the div change when the user drag something into the box*/
    fileUploaderDiv.on("dragenter", function (e) {
        fileUploaderDiv.removeClass().addClass("redDashedBorder");
        showALabel("#duringUpload")
    });

    /*show a label depending on his id*/
    function showALabel(id) {
        info.children("span").hide();
        $(id).show();
    }


    function setNormalTemplate() {
        fileUploaderDiv.removeClass().addClass("greyDashedBorder");
        showALabel("#labelUpload")
    }

    fileUploaderDiv.on("dragleave", function () {
        setNormalTemplate();
    });


    /*this method import a file into the browser and display an error if needed*/
    function previewFile(file) {
        if (file === undefined)
            file = null;
        if(isNaN(file)){
            if (file.type === "application/pdf"){
                $(".fileSelected").text("File selected : " + file.name);
                $(".fileSelected").show();
                $("#duringUpload").hide()
            } else {
                showALabel("#errorUpload")
            }
        }
        fileUploaderDiv.removeClass().addClass("greyDashedBorder");
    }

    $("#changeBtn").click(() => {
        if (fileUploader[0].file === undefined) {

        }
    })
});





