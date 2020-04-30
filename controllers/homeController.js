let genericModel = require('../models/genericMongoDbModel');
let dbNames = require('../models/dbNames');

module.exports.homePage = function (req, res) {
    res.title = "Home";
    if (req.session.userInfo) {
        res.username = req.session.login;
        if (req.session.isAdmin) {
            res.isAdmin = true;
        }
    }

    genericModel.findSortAndLimitWithQuery(dbNames.lessonsDB, {}, {date:-1}, 10, (err, result) => {
        if (err) console.log(err)
        res.lessons = result;
        res.render('homePage', res);
    });
};