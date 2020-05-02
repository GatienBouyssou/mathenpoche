const fs = require("fs");

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
};

module.exports.moveFileToLesson = function (req, body, callback) {
    let oldPath = body.file.path;
    let nameFile = req.session.userInfo.id + "_" + Date.now();
    let newPath = __dirname + '/../views/lessons/' + nameFile + ".pdf";
    fs.rename(oldPath, newPath, function (err) {
        if (err) {
            fs.unlinkSync(body.file.path);
            callback({status: 406, errors: {message: "Couldn't upload your file."}}, null)
        } else {
            body.path = newPath;
            callback();
        }
    });
};