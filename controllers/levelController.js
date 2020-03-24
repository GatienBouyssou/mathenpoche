module.exports.renderLevel = function renderLevel(req, res, levelName) {
    res.levelName = levelName;
    res.title = levelName;
    if (req.session.login) {
        res.username = req.session.login;
        if (req.session.isAdmin) {
            res.isAdmin = true;
        }
    }
    res.render("level", res);
};
