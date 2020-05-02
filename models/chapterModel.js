const genericModel = require('./genericMongoDbModel');
const async = require('async');
const dbNames = require('./dbNames');
let ObjectID = require("mongodb").ObjectID;

module.exports.deleteElement = deleteElement;

function deleteElement(params, callback) {
    async.waterfall([
      function (callback) {
          genericModel.findOneAndDelete(params.elementType, params.elementId, (err, result) => {
              if (err) return callback({status:500, message: "An unexpected error has happened."},null);
              callback(null, result.value.path)
          })
      }, function (path, callback) {
            if (path) {
                fs.unlink(path, (err) => {
                    callback()
                });
            }
        },
      function (callback) {
          let filter = {};
          let objectID = new ObjectID(params.elementId);
          filter[params.elementType] = objectID;
          genericModel.removeObjectFromTables(params.parentDB, filter, params.elementType, objectID, (err, result) => {
              if (err) return callback({status:500, message: "An unexpected error has happened."},null);
              callback()
          })
      }
    ], function (err, result) {
        callback(err, result)
    })
}

module.exports.deleteChapter = function (params, callback) {
    async.waterfall([
        function (callback) {
            let query = {_id: new ObjectID(params.elementId)};
            query[dbNames.lessonsDB] = {$exists: true, $ne:[]};
            genericModel.findWithQuery(dbNames.chaptersDB, query, (err, result) => {
                if (err) return callback({status:500, message: "An unexpected error has happened."},null);
                if (result.length === 0) {
                    callback(null)
                } else {
                    callback({status:400, message: "You can't delete a chapter that is still containing lessons."}, null)
                }
            });
        },
        function (callback) {
            deleteElement(params, callback)
        }
    ], function (err, result) {
        callback(err, result)
    });
};



function formatChapter(body) {
    return {
        title: body.title,
        lessons: [],
        exercises: []
    };
}

module.exports.createChapter = function (body,callback) {
    async.waterfall([
        function (callback) {
            let objectToAdd = formatChapter(body);
            genericModel.insertOneDocument(dbNames.chaptersDB, objectToAdd, (err, result) => {
                if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
                callback(null, result)
            })
        }, function(objectId, callback) {
            let query = {
                $each : [objectId.ops[0]._id]
            };
            if (!isNaN(body.position)) {
                query.$position = body.position;
            }

            genericModel.addObjectToTable(dbNames.levelDB, body.levelName, dbNames.chaptersDB, query, (err, result) => {
                if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
                callback(null, result)
            })
        }
    ], function (err, result) {
        callback(err, result)
    });
};

module.exports.doesChapterExists = doesChapterExists;
function doesChapterExists(levelName, fieldName, fieldValue, callback) {
    genericModel.customAggregation(dbNames.levelDB, findChapterBy(levelName, fieldName, fieldValue), (err, array) => {
        if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
        if (array.length > 0) return callback(null, true);
        callback(null, false)
    });
};

module.exports.getChapters = function (levelName, callback) {
    genericModel.findWithQuery(dbNames.levelDB,{"_id": levelName} ,(err, result) => {
        if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
        callback(null, result)
    })
};

module.exports.createLesson = function(levelName, callback) {
    callback({status:500, message: "Not implemented yet"} ,null)
};

module.exports.getAllMaterialsForLevel = function (levelName, callback) {
    genericModel.customAggregation(dbNames.levelDB, buildAggregationToFindEverythingForALevel(levelName), (err, result) => {
        if (err) return callback({status:500, message: "An unexpected error has happened."}, null);
        callback(null, result)
    })
};



function buildAggregationToFindEverythingForALevel(levelName) {
    return [
        {$match: {_id:levelName}},
        {$unwind: '$chapters'},
        {$lookup: {
            from: dbNames.chaptersDB,
            localField: 'chapters',
            foreignField: '_id',
            as: 'retrievedChapters'}},
        {$unwind:{  path:'$retrievedChapters', preserveNullAndEmptyArrays: true }},
        {$lookup: {
            from: dbNames.exercisesDB,
            localField: 'retrievedChapters.exercises',
            foreignField: '_id',
            as: 'exercisesForChapter'}},
        {$lookup: {
            from: dbNames.lessonsDB,
            localField: 'retrievedChapters.lessons',
            foreignField: '_id',
            as: 'lessonsForChapter'}},
        {$unwind:{  path:'$lessonsForChapter', preserveNullAndEmptyArrays: true } },
        {$lookup: {
            from: dbNames.exercisesDB,
            localField: 'lessonsForChapter.exercises',
            foreignField: '_id',
            as: 'exercisesForLessons'}},
        {$group:{
            _id: {
                _id: '$chapters',
                title: '$retrievedChapters.title',
                exercises: '$exercisesForChapter',
            },
            lessons: {
                $push: {
                    '_id': '$lessonsForChapter._id',
                    'title': '$lessonsForChapter.title',
                    'exercises': '$exercisesForLessons'
                }
            }
        }},
        {$project: {
            "_id":0,
            "_id": "$_id._id",
            "title": "$_id.title",
            "lessons": "$lessons",
            "exercises": "$_id.exercises"
        }}
    ]
}

function findChapterBy(levelName, fieldName, fieldValue) {
    let aggreg = [
        {$match: {_id:levelName}},
        {$unwind: '$chapters'},
        {$lookup: {
                from: dbNames.chaptersDB,
                localField: 'chapters',
                foreignField: '_id',
                as: 'retrievedChapters'}},
        {$unwind:{  path:'$retrievedChapters', preserveNullAndEmptyArrays: true }},

    ];
    let match = {$match: {}};
    match.$match["retrievedChapters."+fieldName] = fieldValue
    aggreg.push(match);
    return aggreg;
}

