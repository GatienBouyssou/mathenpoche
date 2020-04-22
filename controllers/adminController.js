let levelModel = require('../models/levelModel');
let async =require("async");

module.exports.add = function (req, res) {
    if (req.session.userInfo && req.session.userInfo.isAdmin) {
        res.title = "Add";
        res.itemType = req.query.type;
        res.levelName = req.query.levelName;
        levelModel.getChapters(res.levelName, (err,result) => {
            if (result) res.chapters = result[0].chapter;
            res.render('addElement', res);
        });
    } else {
        res.message = "Page not found";
        res.error = {};
        res.error.status = 404;
        res.error.stack = "This page does not exist";
        res.render('error', res)
    }
};

module.exports.create = function(req, res) {
    switch (req.body.typeElement) {
        case "chapter":
            async.waterfall([
                function(callback) {
                    levelModel.createChapter(req.body, (err, result) => {
                        if (err) return callback(err, null);
                        callback()
                    });
                },
                function (callback) {
                    levelModel.getChapters(req.body.levelName, (err, result) => {callback(err, result)})
                }],
                function (err, result) {
                    if (err) {
                        res.status(err.status);
                        res.send({errors: {message: err.message}})
                    } else {
                        console.log(result);
                        res.chapters = result[0].chapter;
                        res.layout = false;
                        res.render('components/addElementForm', res)
                    }
                });

            break;
        case "lesson":

            break;
        case "exercise":

            break;
        default :
            throw Error("Sorry, this element type doesn't exist.")
    }
};
