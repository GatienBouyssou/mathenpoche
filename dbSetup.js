const MongoClient = require('mongodb').MongoClient;
let dbPort = 27017;
let dbHost = 'localhost';
let dbName = 'mathenpoche';
let mongoServer = 'mongodb://';
let mongoOptions = { useNewUrlParser: true };
let url = mongoServer + dbHost + ':' + dbPort + '/' + dbName;

let DataBase = function () {
};

DataBase.getConnection = function(callback) {
    if (callback) {
        if (typeof DataBase.db !== 'undefined') {
            callback(DataBase.db);
            return;
        }
        DataBase.initDB(callback);
    }
};

DataBase.initDB = function(callback) {
    MongoClient.connect(url, mongoOptions, function(err, database){
        if(err) {
            console.log(err);
            process.exit(1);
        }
        DataBase.db = database.db(dbName);
        callback(DataBase.db)
    });
};
module.exports = DataBase;

