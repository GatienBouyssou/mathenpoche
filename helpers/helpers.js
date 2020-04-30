module.exports.pageNotFound = function(res) {
    res.message = "Page not found";
    res.error = {};
    res.error.status = 404;
    res.error.stack = "This page does not exist";
    res.status(404);
    res.render('error', res);
};

module.exports.isStringEmpty = function (title) {
    return !title || typeof title !== "string" || title === "";
}