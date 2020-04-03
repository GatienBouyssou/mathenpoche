let genericModel = require('../models/genericMongoDbModel');
let cryptoHelper = require('../helpers/cryptoHelper');


module.exports.connectionPage = function (req, res) {
    if (req.session.userInfo) {
        res.redirect("/")
    } else {
        res.title = "Login / Sign up";
        res.isConnecting = true;
        res.render('connectionPage', res)
    }
};

module.exports.signIn = function (req, res) {
    let userCredentials = {
        "email" : req.body.username,
        "password": cryptoHelper.hash(req.body.password)
    };
    genericModel.findWithQuery("user", userCredentials, (error, result) => {
       if(error) {
            res.render('connectionPage', {title : "Login / Sign up", isConnecting : true,status: 500, message: "Sorry an error has happen while your connection."});
           return;
       }
       if(result.length === 0) {
           res.render('connectionPage', {title : "Login / Sign up", isConnecting : true, status: 400, message: "Wrong credentials."});
           return;
       }
       req.session.userInfo = buildSession(result[0]);
       res.redirect("/");
    });
};

module.exports.signUp = function (req, res) {
    let newUser = buildNewUser(req.body);
    genericModel.insertOneDocument("user", newUser, (err, result) => { // create User
        if (err) {
            res.render('connectionPage', {title : "Login / Sign up", isSigningUp: true,isConnecting : true,status: 500, message: "Sorry an error happen while your connection."});
        } else {
            req.session.userInfo = buildSession(result.ops[0]); // log in
            res.redirect('/');
        }
    });
};

module.exports.logout = function (req, res) {
    req.session.userInfo = null;
    res.redirect('/');
};

function buildNewUser(body) {
    return {
        username : body.username,
        firstName: body.firstName,
        surname: body.surname,
        email: body.email,
        password: cryptoHelper.hash(body.password)
    }
}

function buildSession(user) {
    return {
        isAdmin:user.isAdmin,
        id:user._id,
        username : user.username
    };
}

