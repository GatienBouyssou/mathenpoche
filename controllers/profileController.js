module.exports.profilePage = function(req, res) {
    if (req.session.login) {
        res.title = 'Profile';
        res.username = req.session.login;
        if (req.session.isAdmin) {
            res.isAdmin = true;
        }
        res.render('profilePage', res);
    } else {
        res.message = "Page not found";
        res.error = {};
        res.error.status = 404;
        res.error.stack = "This page does not exist";
        res.render('error', res)
    }
};