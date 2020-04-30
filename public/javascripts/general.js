$(document).ready(function() {
    materializeInit()
    $(".dropdown-trigger").dropdown();
});

function materializeInit() {
    M.AutoInit();
    M.updateTextFields();
}