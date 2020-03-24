let homeController = require("../controllers/homeController");
let levelController = require("../controllers/levelController");
let authController = require("../controllers/authenticationController");
let profileController = require("../controllers/profileController");
let adminController = require("../controllers/adminController");

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

    app.get('/addChapter', (req, res) => {adminController.add(req, res, 'chapter')});
    app.get('/addLesson', (req, res) => {adminController.add(req, res, 'lesson')});
    app.get('/addExercise', (req, res) => {adminController.add(req, res, 'exercise')});

    // post routes
    app.post("/signIn", authController.signIn);
    app.post("/signUp", authController.signUp);

    app.get("*", (req, res) => {res.render('error', res)});
};

