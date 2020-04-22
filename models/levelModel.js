const genericModel = require('./genericMongoDbModel');
const levelDB = "level";

function formatChapter(body) {
    return {
        title: body.title,
    };
}

module.exports.createChapter = function (body,callback) {
    let query  = {};
    query["_id"] = body.levelName;
    query[body.typeElement] = {"title":body.title};
    genericModel.findWithQuery(levelDB, query, (err, array) => {
        if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
        if (array.length > 0) return callback({status:400, message:"This chapter already exists."}, null);
        let objectToAdd = {
            $each : [formatChapter(body)]
        };

        if (!isNaN(body.position)) {
            objectToAdd.$position = body.position;
        }

        genericModel.addObjectToTable(levelDB, body.levelName, body.typeElement, objectToAdd, (err, result) => {
            if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
            callback(null, result)
        })
    });
};

module.exports.getChapters = function (levelName, callback) {
    genericModel.findWithQuery(levelDB,{"_id": levelName} ,(err, result) => {
        if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
        callback(null, result)
    })
};

module.exports.createLesson = function(levelName, callback) {

};