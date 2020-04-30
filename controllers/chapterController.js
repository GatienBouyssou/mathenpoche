let chapterModel = require('../models/chapterModel');
let lessonModel = require('../models/lessonModel');
let async =require("async");
let ObjectID = require("mongodb").ObjectID;
let helpers = require('../helpers/helpers');
const fs = require('fs');

module.exports.createChapter = function(req, res) {
    async.waterfall([
            function (callback) {
                chapterModel.createChapter(req.body, (err, result) => {
                    if (err) return callback(err, null);
                    callback()
                });
            },
            function (callback) {
                chapterModel.getAllMaterialsForLevel(req.body.levelName, (err, result) => {
                    callback(err, result)
                })
            }],
        function (err, result) {
            if (err) {
                res.status(err.status);
                res.send({errors: {message: err.message}})
            } else {
                res.chapters = result;
                res.layout = false;
                res.render('components/addElementForm', res)
            }
        });
};
