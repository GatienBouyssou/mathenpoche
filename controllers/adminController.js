let chapterModel = require('../models/chapterModel');
let genericModel = require('../models/genericMongoDbModel');
let ObjectID = require("mongodb").ObjectID;

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
    if (!req.session.userInfo|| !req.session.userInfo.isAdmin) return helpers.pageNotFound(res);
    if (helpers.isStringEmpty(req.params.elementId)) return helpers.pageNotFound(res);
    let elementType = req.params.elementType;
    switch (elementType) {
        case dbNames.chaptersDB:
            chapterController.deleteChapter(req, res);
            break;
        case dbNames.lessonsDB:
            lessonController.deleteLesson(req, res);
            break;
        case dbNames.exercisesDB:
            req.params.parentDB = dbNames.parentExerciseDB;
            res.status(501);
            res.send({errors: {message: "Not implemented yet."}});
            break;
        default:
            return helpers.pageNotFound(res);
    }
};

module.exports.getEditPage = function (req, res) {
    if (!req.session.userInfo || !req.session.userInfo.isAdmin) return helpers.pageNotFound(res);
    if (helpers.isStringEmpty(req.params.elementId)) return helpers.pageNotFound(res);
    let elementType = req.params.elementType;
    if (elementType !== dbNames.chaptersDB && elementType !== dbNames.lessonsDB && elementType !== dbNames.exercisesDB)
        return helpers.pageNotFound(res);

    genericModel.findDocumentById(elementType, req.params.elementId, (err, result) => {
        if (err || !result) return helpers.pageNotFound(res);
        res.title = "Edit";
        res.elementType = elementType;
        res.levelName = req.params.levelName;
        res.element = result;
        res.render('editPage', res)
    })
};

module.exports.editElement = function (req, res) {
    genericModel.findOneAndModify(req.body.table, req.body.id, {$set:req.body.query}, (err, result) => {
        if (err) {
            if (req.body.query.path) fs.unlinkSync(req.body.query.path);
            res.status(err.status);
            return res.send({errors: {message: "An unexpected error has occurred"}})
        }
        if (result.value.path && req.body.query.path) fs.unlinkSync(req.body.query.path);
        res.send("/" + req.body.level)
    })
};