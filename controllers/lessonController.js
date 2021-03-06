let chapterModel = require('../models/chapterModel');
let lessonModel = require('../models/lessonModel');
const dbNames = require('../models/dbNames');

let async =require("async");
let ObjectID = require("mongodb").ObjectID;
let helpers = require('../helpers/helpers');
const fs = require('fs');

module.exports.createLesson = function(req, res) {
    async.waterfall([
        function (callback) {
            helpers.moveFileToLesson(req, req.body, callback)
        },
        function (callback) {
            lessonModel.createLesson(req.body, (err, result) => {
                if (err) {
                    fs.unlinkSync(req.path);
                    return callback(err, null);
                }
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
};

module.exports.deleteLesson = function (req, res) {
    req.params.parentDB = dbNames.parentLessonDB;
    chapterModel.deleteElement(req.params, (err, result) => {
        if (err) {
            res.status(err.status);
            res.send({errors: {message: err.message}})
        } else {
            res.status(200);
            res.send("Item deleted.")
        }
    });
};


