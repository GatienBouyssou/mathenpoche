let userModel = require("../models/userModel");
let genericModel = require('../models/genericMongoDbModel');
let cryptoHelper = require('../helpers/cryptoHelper');
let helpers = require('../helpers/helpers');

module.exports.profilePage = function(req, res) {
    if (req.session.userInfo) {
        genericModel.findDocumentById("user", req.session.userInfo.id, (err, result) => {
            res.title = 'Profile';
            res.body = result;
            res.render('profilePage', res);
        });
    } else {
        helpers.pageNotFound(res)
    }
};

module.exports.modifyProfile = function (req, res) {
    if (req.session.userInfo) {
        let newUser = buildNewUser(req.body);
        userModel.modifyUser(req.session.userInfo.id, newUser,(err, result) => {
            if (err) throw err;
            req.session.userInfo.username = newUser.username;
            let response = {message : "The user has been modified"};
            res.status = 200;
            res.send(response);
        })
    } else {
        helpers.pageNotFound(res)
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