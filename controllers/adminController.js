let chapterModel = require('../models/chapterModel');
let helpers = require('../helpers/helpers');
const lessonController = require('./lessonController');
const chapterController = require('./chapterController');
const dbNames = require('../models/dbNames');

module.exports.levelInfo = function(req, res) {
    if (!req.session.userInfo && !req.session.userInfo.isAdmin) {
        helpers.pageNotFound(res);
        return;
    }
    let levelName = req.params.levelName;
    if (levelName !== "Troisieme" && levelName !== "Quatrieme" && levelName !== "Cinquieme" && levelName !== "Sixieme"){
        res.status(400);
        return res.send({errors: {message: "This level does not exist"}});
    }
    chapterModel.getAllMaterialsForLevel(levelName, (err, result) => {
        if (err) {
            res.status(err.status);
            res.send({errors: {message: err.message}})
        } else {
            res.chapters = result;
            res.layout = false;
            res.render('components/addElementForm', res)
        }
    })
};

module.exports.add = function (req, res) {
    if (req.session.userInfo && req.session.userInfo.isAdmin) {
        res.title = "Add";
        res.itemType = req.query.type;
        res.levelName = req.query.levelName;
        chapterModel.getAllMaterialsForLevel(res.levelName, (err,result) => {
            if (result) res.chapters = result;
            res.render('addElement', res);
        });
    } else {
        helpers.pageNotFound(res)
    }
};

module.exports.create = function(req, res) {
    switch (req.body.typeElement) {
        case "chapter":
            chapterController.createChapter(req, res);
            break;
        case "lesson":
            lessonController.createLesson(req, res);
            break;
        case "exercise":
            res.status(400);
            res.send({errors: {message: "No implemented Yet."}});
            break;
        default :
            throw Error("Sorry, this element type doesn't exist.")
    }
};

module.exports.deleteElement = function(req, res) {
    if (!req.session.userInfo && !req.session.userInfo.isAdmin) return helpers.pageNotFound(res);
    if (helpers.isStringEmpty(req.params.elementId)) return helpers.pageNotFound(res);
    let elementType = req.params.elementType;
    switch (elementType) {
        case dbNames.chaptersDB:
            req.params.parentDB = dbNames.parentChapterDB;
            chapterModel.deleteChapter(req.params, (err, result) => {
                if (err) {
                    res.status(err.status);
                    res.send({errors: {message: err.message}})
                } else {
                    res.status(200);
                    res.send("Item deleted.")
                }
            });
            break;
        case dbNames.lessonsDB:
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
            break;
        case dbNames.exercisesDB:
            req.params.parentDB = dbNames.parentExerciseDB;
            break;
        default:
            return helpers.pageNotFound(res);
    }
};