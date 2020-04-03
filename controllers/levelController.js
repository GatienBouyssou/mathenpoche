module.exports.renderLevel = function renderLevel(req, res, levelName) {
    res.levelName = levelName;
    res.title = levelName;
    if (req.session.userInfo) {
        res.username = req.session.login;
        if (req.session.userInfo.isAdmin) {
            res.isAdmin = true;
        }
    }
    res.render("level", res);
};
