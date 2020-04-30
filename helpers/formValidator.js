const { check, validationResult } = require('express-validator');
let generalModel = require("../models/genericMongoDbModel");

module.exports.userValidationRules = () => {
    return [
        check('username').notEmpty().withMessage("The field can't be empty").escape(),
        check('firstName').notEmpty().withMessage("The field can't be empty").escape(),
        check('surname').notEmpty().withMessage("The field can't be empty").escape(),
        check('email')
            .notEmpty().withMessage("The field can't be empty").escape()
            .isEmail().withMessage("The email is not valid."),

        // password must be at least 5 chars long
        check('password').notEmpty().withMessage("The field can't be empty").escape()
            .isLength({ min: 5 }).withMessage("The password must be greater than 5 characters")
            .matches(/\d/).withMessage("The password must contain letters and numbers")
            .matches(/\D/).withMessage("The password must contain letters and numbers"),
        check('confirmedPassword').escape().custom((value, { req })=> {
            if (value !== req.body.password) {
                throw new Error("The passwords do not match.")
            }
            return true;
        })
    ]
};

module.exports.validate = (req, res, next) => {
    generalModel.findWithQuery("user", {"email":req.body.email}, (err, result) => {
        const errors = validationResult(req);
        if (!err && result.length === 0 && errors.isEmpty()) return next();

        let extractedErrors = {};
        errors.array().map(err => extractedErrors[err.param] = err.msg);
        if (!extractedErrors.email && (err || result.length > 0)) extractedErrors["email"] = "This email already exists.";
        res.render('connectionPage', {title : "Login / Sign up", isSigningUp: true, isConnecting : true,status: 400, body: req.body, errors:extractedErrors});
    });
};


function validatePassword(value) {
    return value.length > 5 && /\d/.test(value) && /\D/.test(value);
}

module.exports.userValidationRulesProfile = () => {
    return [
        check('username').notEmpty().withMessage("The field can't be empty").escape(),
        check('firstName').notEmpty().withMessage("The field can't be empty").escape(),
        check('surname').notEmpty().withMessage("The field can't be empty").escape(),
        check('email')
            .notEmpty().withMessage("The field can't be empty").escape()
        .isEmail().withMessage("The email is not valid."),

        // password must be at least 5 chars long
        check('password').escape().custom((value, { req })=> {
            if (value === "") return true;
            if (validatePassword(value)) {
                return true;
            }
            throw new Error("The password must contain +5 char and numbers.")
        }),

        check('confirmedPassword').escape().custom((value, { req })=> {
            if (value !== req.body.password) {
                throw new Error("The passwords do not match.")
            }
            return true;
        })
]
};


function checkEmail(result, userInfo) {
    if (result.length === 0) return true;
    let exist = false;
    result.forEach((element) => {
        if (element._id == userInfo.id) exist = true;
    });
    return exist;
}

module.exports.validateProfile = (req, res, next) => {
    if (!req.session.userInfo || !req.session.userInfo.isAdmin) {
        res.message = "Page not found";
        res.error = {};
        res.error.status = 404;
        res.error.stack = "This page does not exist";
        res.render('error', res);
        return;
    }
    generalModel.findWithQuery("user", {"email":req.body.email}, (err, result) => {
        const errors = validationResult(req);
        let emailIsValid = checkEmail(result, req.session.userInfo);
        if (!err && emailIsValid && errors.isEmpty()) return next();

        let extractedErrors = {};
        errors.array().map(err => extractedErrors[err.param] = err.msg);
        if (!extractedErrors.email && !emailIsValid) extractedErrors["email"] = "This email already exists.";

        res.status(400);
        res.send({message: "Invalid input", errors:extractedErrors})
    });
};


//login

module.exports.escapeAllField = () => {
    return [
        check('*').escape()
    ]
};




