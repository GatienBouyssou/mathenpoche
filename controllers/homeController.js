module.exports.homePage = function (req, res) {
    res.title = "Home";
    if (req.session.userInfo) {
        res.username = req.session.login;
        if (req.session.isAdmin) {
            res.isAdmin = true;
        }
        res.render('homePage', res);
    } else {
        res.render('homePage', res);
    }
};