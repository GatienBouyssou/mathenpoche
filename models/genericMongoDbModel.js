const dbConnection = require("../dbSetup");
let ObjectID = require("mongodb").ObjectID;

module.exports.insertOneDocument = function (table, object, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).insertOne(object, (err, result)=>{callback(err, result)})
    })
};

module.exports.insertManyDocument = function (table, objects, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).insertMany(objects, (err, result)=>{callback(err, result)})
    })
};

    module.exports.deleteOneDocument = function (table, object, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).deleteOne(object, (err, result)=>{callback(err, result)})
    })
};

module.exports.deleteManyDocument = function (table, objects, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).deleteMany(objects, (err, result)=>{callback(err, result)})
    })
};

module.exports.updateOneDocument = function (table, identifier, objectChanges, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).updateOne(identifier, objectChanges, (err, result)=>{callback(err, result)});
    });
};

module.exports.updateManyDocument = function (table, identifier, objectChanges, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).updateMany(identifier, objectChanges, (err, result)=>{callback(err, result)});
    });
};

module.exports.addObjectToTable = function(table, id, fieldToModify, object, callback) {
    let query = {};
    query[fieldToModify] = object;
    dbConnection.getConnection((db) => {
        db.collection(table).updateOne({_id:id},{$push : query}, (err, result) => {callback(err, result)})
    })
};

module.exports.removeObjectFromTable = function(table, id, fieldToModify, object, callback) {
    let query = {};
    query[fieldToModify] = object;
    dbConnection.getConnection((db) => {
        db.collection(table).updateMany({_id:new ObjectID(id)},{$pull : query}, (err, result) => {callback(err, result)})
    })
};

module.exports.removeObjectFromTables = function(table, filter, fieldToModify, object, callback) {
    let query = {};
    query[fieldToModify] = object;
    dbConnection.getConnection((db) => {
        db.collection(table).updateOne(filter,{$pull : query}, (err, result) => {callback(err, result)})
    })
};

module.exports.findDocumentById = function (table, objectId, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).findOne({_id : new ObjectID(objectId)}, (err, result)=>{callback(err, result)})
    })
};

module.exports.findWithQuery = function (table, query, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).find(query).toArray((err, result)=>{callback(err, result)})
    })
};

module.exports.findSortAndLimitWithQuery = function(table, findQuery, sortQuery, limit, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).find(findQuery).sort(sortQuery).limit(limit).toArray((err, result)=>{callback(err, result)})
    })
};

module.exports.findOneElementOfArrayWithAggregation = function (table, userId, filter, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).aggregate([
            {$match: {_id:userId}},
            {
                $project: {
                    startedSeries:
                        {
                            $filter: filter
                        }
                }
            }
        ]).toArray((err, result) => {
            callback(err, result)
        });
    });
};

module.exports.customAggregation = function(table, aggregation, callback) {
    dbConnection.getConnection((db) => {
        db.collection(table).aggregate(aggregation).toArray((err, result) => {
            callback(err, result)
        })
    })
};