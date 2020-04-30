const formidable = require('formidable');
const async = require('async');
const mmm = require('mmmagic'),
    Magic = mmm.Magic;

const levelModel = require('../models/chapterModel');
const lessonModel = require('../models/lessonModel');
let ObjectID = require("mongodb").ObjectID;

const cryptoHelper = require('../helpers/cryptoHelper');
const helpers = require('../helpers/helpers')
// escape add ELement

function checkChapterValidity(body, errors, callback) {
    body.position = parseInt(body.position);
    if (body.position && typeof body.position !== "number")
        errors.position ="The position should have a numeric value";
    if (helpers.isStringEmpty(body.title))
        errors.title = "The title must be a string and must not be empty.";
    else
        levelModel.doesChapterExists(body.levelName, "title", body.title, (error, chapterDoesExist) => {
            if (error) {
                errors.chapter = error.message;
                return callback({status:400, errors: errors}, null);
            }
            if (chapterDoesExist) {
                errors.chapter = "This chapter title already exist.";
                return callback({status:400, errors: errors}, null);

            }
            if (Object.keys(errors).length === 0) {
                callback(null, body)
            } else {
                callback({status:400, errors: errors}, null);
            }
        });
    return true;
}

function checkLessonValidity(body, errors, callback) {
    async.parallel([
        function (callback) {
            body.position = parseInt(body.position);
            if (body.position && typeof body.position !== "number")
                errors.position = "The position should have a numeric value";
            callback(null, true)
        },
        function (callback) {
            let fileSize = body.file.size/1000;
            if (fileSize > 1000) errors.fileSize = "The file size is " + fileSize + "KB but it shouldn't be over 1000KB.";
            let magic = new Magic(mmm.MAGIC_MIME);
            // the above flags can also be shortened down to just: mmm.MAGIC_MIME
            magic.detectFile(body.file.path, function(err, result) {
                if (err) errors.file = "We couldn't upload the file.";
                if (result !== "application/pdf; charset=binary") errors.fileType = "You can only upload a pdf";
                callback(null, true)
            });
        }, function (callback) {
            if (helpers.isStringEmpty(body.title)) {
                errors.title = "The title can't be empty.";
                return callback(null)
            }

            async.waterfall([
                function (callback) {
                    if (helpers.isStringEmpty(body.chapterId)){
                        errors.chapter = "Invalid chapter ID";
                        return callback(errors, null)
                    }
                    levelModel.doesChapterExists(body.levelName, "_id", new ObjectID(body.chapterId), (error, chapterDoesExist) => {
                        if (error) {
                            errors.chapter = error.message;
                            return callback(errors, null);
                        }
                        if (chapterDoesExist) {
                            callback(null)
                        } else {
                            errors.chapter = "This chapter ID does not exist.";
                            callback(errors, null);
                        }
                    });
                }, function (callback) {
                    lessonModel.doesLessonExists(body.levelName, body.chapterId, "title", body.title, (error) => {
                        if (error) {
                            errors.title = error.message;
                            callback(errors, null);
                        } else {
                            callback(null)
                        }
                    })
                }
            ], function (err, result) {
                callback(null)
            })
        }
    ], function (err, result) {
        if (Object.keys(errors).length === 0) {
            callback(null, body)
        } else {
            callback({status:400, errors: errors}, null)
        }
    })
}

function checkExerciseValidity(body) {

}

function validateElementToCreate(body, callback) {
    let errors = {};
    if (body.levelName !== "Troisieme" && body.levelName !== "Quatrieme" && body.levelName !== "Cinquieme" && body.levelName !== "Sixieme") {
        errors.level =  "Sorry, this level doesn't exist.";
        return callback({status:400, errors: errors}, null);
    }

    switch (body.typeElement) {
        case "chapter":
            checkChapterValidity(body, errors, callback);
            break;
        case "lesson":
            checkLessonValidity(body, errors, callback);
            break;
        case "exercise":
            checkExerciseValidity(body, errors);
            callback({status:400, errors: {message: "Not implemented yet."}}, null);
            break;
        default :
            errors.level = "Sorry, this element type doesn't exist.";
            return callback({status:400, errors: errors}, null);
    }

}

module.exports.validateElement = (req, res, next) => {
    if (!req.session.userInfo || !req.session.userInfo.isAdmin) {
        res.message = "Page not found";
        res.error = {};
        res.error.status = 404;
        res.error.stack = "This page does not exist";
        res.render('error', res);
        return;
    }
    async.waterfall([
        function (callback) {
            let form = formidable.IncomingForm({ uploadDir: __dirname + '/../uploads' }); // when a file is uploaded it goes into uploads
            form.parse(req, function (err, fields, files) {
                if (err) {
                    callback({status:406, errors: {message: "Error while receiving the form"}}, null)
                } else {
                    callback(null, fields, files); // return all the elements needed to save the image
                }
            });
        },
        function (fields, files, callback) {
            fields.file = files.lessonFile;
            validateElementToCreate(fields, callback);
        }],
        function (err, result) {
            if (err) {
                res.status(err.status);
                res.send({errors: err.errors})
            } else {
                req.body = result;
                return next();
            }
        }
    );
};
