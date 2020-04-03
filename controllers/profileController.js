let userModel = require("../models/userModel");
let genericModel = require('../models/genericMongoDbModel');
let cryptoHelper = require('../helpers/cryptoHelper');

module.exports.profilePage = function(req, res) {
    if (req.session.userInfo) {
        genericModel.findDocumentById("user", req.session.userInfo.id, (err, result) => {
            res.title = 'Profile';
            res.body = result;
            res.render('profilePage', res);
        });
    } else {
        res.message = "Page not found";
        res.error = {};
        res.error.status = 404;
        res.error.stack = "This page does not exist";
        res.render('error', res)
    }
};

module.exports.modifyProfile = function (req, res) {
    if (req.session.userInfo) {
        let newUser = buildNewUser(req.body);
        console.log(newUser);
        userModel.modifyUser(req.session.userInfo.id, newUser,(err, result) => {
            if (err) throw err;
            let response = {message : "The user has been modified"};
            res.status = 200;
            res.send(response);
        })
    } else {
        res.message = "Page not found";
        res.error = {};
        res.error.status = 404;
        res.error.stack = "This page does not exist";
        res.render('error', res)
    }
};

function buildNewUser(body) {
    let user = {
        username : body.username,
        firstName: body.firstName,
        surname: body.surname,
        email: body.email,
    };
    if (body.password && body.password !== "") {
      user.password = cryptoHelper.hash(body.password);
    }
    return user;
}