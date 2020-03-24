module.exports.connectionPage = function (req, res) {
    if (req.session.login) {
        res.username = req.session.login;
        res.redirect("/")
    } else {
        res.title = "Login / Sign up";
        res.isConnecting = true;
        res.render('connectionPage', res)
    }
};

module.exports.signIn = function (req, res) {
    console.log(req.body);
    if (req.body.username === "admin") {
        req.session.isAdmin = true;
    }
    req.session.login = "login";
    res.redirect("/");
};

module.exports.signUp = function (req, res) {
    req.session.login = "login";
    res.redirect("/");
};

module.exports.logout = function (req, res) {
    req.session.login = null;
    res.redirect('/');
};
