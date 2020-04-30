let chapterModel = require('../models/chapterModel');
let lessonModel = require('../models/lessonModel');
let async =require("async");
let ObjectID = require("mongodb").ObjectID;
let helpers = require('../helpers/helpers');
const fs = require('fs');

module.exports.createLesson = function(req, res) {
    async.waterfall([
        function (callback) {
            let oldPath = req.body.file.path;
            let nameFile = req.session.userInfo.id + "_" + Date.now();
            let newPath = __dirname + '/../views/lessons/' + nameFile + ".pdf";
            fs.rename(oldPath, newPath, function (err) {
                if (err) {
                    callback({status: 406, errors: {message: "Couldn't upload your file."}}, null)
                } else {
                    req.body.path = newPath;
                    callback();
                }
            });
        },
        function (callback) {
            lessonModel.createLesson(req.body, (err, result) => {
                if (err) return callback(err, null);
                callback()
            })
        },
        function (callback) {
            chapterModel.getAllMaterialsForLevel(req.body.levelName, (err, result) => {
                callback(err, result)
            })
        }
    ], function (err, result) {
        if (err) {
            res.status(err.status);
            res.send({errors: {message: err.message}});
        } else {
            res.status(200);
            res.chapters = result;
            res.layout = false;
            res.render('components/addElementForm', res)
        }

    });
}


