let levelModel = require('../models/levelModel');

module.exports.renderLevel = function(req, res, levelName) {
    res.levelName = levelName;
    res.title = levelName;
    if (req.session.userInfo) {
        res.username = req.session.login;
        if (req.session.userInfo.isAdmin) {
            res.isAdmin = true;
        }
    }
    levelModel.getChapters(levelName, (err, result) => {
        res.chapters = result[0].chapter;
        res.render("level", res);
    });
};

