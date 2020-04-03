const genericModel = require('./genericMongoDbModel');
const ObjectID = require('mongodb').ObjectId;

module.exports.modifyUser = function (userId, modifications, callback) {
    genericModel.updateOneDocument("user", {_id: new ObjectID(userId)}, {$set:modifications}, (err, result) => {
        callback(err, result)
    })
};
