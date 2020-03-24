module.exports.add = function (req, res, itemType) {
    if (req.session.login && req.session.isAdmin) {
        res.title = "Add";
        res.itemType = itemType;
        res.render('addElement', res);
    } else {
        res.message = "Page not found";
        res.error = {};
        res.error.status = 404;
        res.error.stack = "This page does not exist";
        res.render('error', res)
    }
};