let genericModel = require('./genericMongoDbModel');
let dbNames = require('./dbNames');

let ObjectID = require("mongodb").ObjectID;
const async = require('async');

module.exports.doesLessonExists = function (levelName, chapterId, fieldName, fieldValue, callback) {
    genericModel.customAggregation(dbNames.levelDB, buildAggrFindLessonWith(levelName, chapterId, fieldName, fieldValue), (err, result) => {
        if (err) return callback({status:500, message: "An unexpected error has happened."});
        if (result.length > 0) return callback({status:400, message:"This lesson already exists."});
        callback(null)
    })
};

module.exports.createLesson = function (body, callback) {
    async.waterfall([
        function (callback) {
            let objectToAdd = buildLesson(body);
            genericModel.insertOneDocument(dbNames.lessonsDB, objectToAdd, (err, result) => {
                if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
                callback(null, result.ops[0]._id)
            })
        }, function(objectId, callback) {
            let query = {
                $each : [objectId]
            };
            if (!isNaN(body.position)) {
                query.$position = body.position;
            }

            genericModel.addObjectToTable(dbNames.chaptersDB, new ObjectID(body.chapterId),dbNames.lessonsDB, query, (err, result) => {
                if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
                callback(null, result)
            })
        }
    ], function (err, result) {
        callback(err, result)
    });
};

function buildLesson(body) {
    let lesson = {
        title: body.title,
        path: body.path,
        date: Date.now()
    };
    switch (body.levelName) {
        case "Troisieme":
            lesson.levelName = "3e";
            break;
        case "Quatrieme":
            lesson.levelName = "4e";
            break;
        case "Cinquieme":
            lesson.levelName = "5e";
            break;
        case "Sixieme":
            lesson.levelName = "6e";
            break;
    }
    return lesson;
}

function buildAggrFindLessonWith(levelName, chapterId, fieldName, fieldValue) {
    let aggreg = [
        {$match: {_id:levelName}},
        {$unwind: '$chapters'},
        {$lookup: {
                from: dbNames.chaptersDB,
                localField: 'chapters',
                foreignField: '_id',
                as: 'retrievedChapters'}},
        {$unwind:{  path:'$retrievedChapters', preserveNullAndEmptyArrays: true }},
        {$match: {"retrievedChapters._id": new ObjectID(chapterId)}},
        {$lookup: {
                from: dbNames.lessonsDB,
                localField: 'retrievedChapters.lessons',
                foreignField: '_id',
                as: 'lessonsForChapter'}},
        {$unwind:{  path:'$lessonsForChapter', preserveNullAndEmptyArrays: true } },
    ];
    let match = {$match: {}};
    match.$match["lessonsForChapter."+fieldName] = fieldValue;
    aggreg.push(match);
    return aggreg;
}