let homeController = require("../controllers/homeController");
let levelController = require("../controllers/levelController");
let authController = require("../controllers/authenticationController");
let adminController = require("../controllers/adminController");
let profileController = require("../controllers/profileController");
const validator = require('../helpers/formValidator');
const validatorFormData = require('../helpers/validatorFormData');

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

    app.get("/lesson/:lessonId", levelController.getLesson);
    // Pages only for logged user
    app.get("/profile", profileController.profilePage);
    app.post("/profile", validator.userValidationRulesProfile(), validator.validateProfile, profileController.modifyProfile);

    // Pages for admin only
    app.get('/add', adminController.add);

    app.post('/create', validatorFormData.validateElement, adminController.create);
    app.get('/edit/:elementType/:elementId');
    app.get('/levelInfo/:levelName', adminController.levelInfo);

    app.delete('/:elementType/:elementId', adminController.deleteElement);
    // post routes
    app.post("/signIn", validator.escapeAllField(), authController.signIn);
    app.post("/signUp", validator.userValidationRules(), validator.validate, authController.signUp);

    app.get("*", (req, res) => {
        res.message = "This page cannot be found.";
        res.error = {status:'Error 404', stack: "It seems that page does not exist try another url."};
        res.status(404);
        res.render('error', res)
    });
};

