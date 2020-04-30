let levelModel = require('../models/chapterModel');
let genericModel = require('../models/genericMongoDbModel');
let dbNames = require('../models/dbNames');
let fs = require('fs');
let helpers = require('../helpers/helpers');

module.exports.renderLevel = function(req, res, levelName) {
    res.levelName = levelName;
    res.title = levelName;
    if (req.session.userInfo) {
        res.username = req.session.login;
        if (req.session.userInfo.isAdmin) {
            res.isAdmin = true;
        }
    }
    levelModel.getAllMaterialsForLevel(levelName, (err, result) => {
        res.chapters = result;
        res.render("level", res);
    });
};

module.exports.getLesson = function (req, res) {
    let lessonId = req.params.lessonId;
    if (!lessonId || typeof lessonId !== "string" || lessonId === "") {
        helpers.pageNotFound(res)
    }
    lessonId = encodeURI(lessonId);
    genericModel.findDocumentById(dbNames.lessonsDB, lessonId, (err, result) => {
        if (err) {
            helpers.pageNotFound(res)
        } else {
            fs.readFile(result.path , function (err,data){
                res.setHeader('Content-disposition', 'inline; filename="lesson.pdf"');
                res.setHeader('Content-type', 'application/pdf');
                res.send(data);
            });
        }
    })
};