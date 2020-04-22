let homeController = require("../controllers/homeController");
let levelController = require("../controllers/levelController");
let authController = require("../controllers/authenticationController");
let adminController = require("../controllers/adminController");
let profileController = require("../controllers/profileController");
const validator = require('../helpers/formValidator');

module.exports = function (app) {

    //  routes when getting the pages
    app.get("/", homeController.homePage); // Home

    // all the levels
    app.get("/troisieme", (req, res) => {levelController.renderLevel(req, res, "Troisieme")});
    app.get("/quatrieme", (req, res) => {levelController.renderLevel(req, res, "Quatrieme")});
    app.get("/cinquieme", (req, res) => {levelController.renderLevel(req, res, "Cinquieme")});
    app.get("/sixieme", (req, res) => {levelController.renderLevel(req, res, "Sixieme")});

    app.get("/about", (req, res) => {res.title = "About"; res.render('about', res)});

    // Connection page
    app.get("/connection", authController.connectionPage);
    app.get("/logout", authController.logout);

    // Pages only for logged user
    app.get("/profile", profileController.profilePage);
    app.post("/profile", validator.userValidationRulesProfile(), validator.validateProfile, profileController.modifyProfile);

    app.get('/add', adminController.add);

    app.post('/create', validator.validationCreateElement(), validator.validateElement, adminController.create);

    // post routes
    app.post("/signIn", validator.escapeAllField(), authController.signIn);
    app.post("/signUp", validator.userValidationRules(), validator.validate, authController.signUp);

    app.get("*", (req, res) => {
        res.message = "This page cannot be found.";
        res.error = {status:'Error 404', stack: "It seems that this page does not exist try another url."};
        res.render('error', res)
    });
};

