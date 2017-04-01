var path        = require('path');
var bodyParser  = require('body-parser');
var validator   = require('validator');
var md5         = require('md5');
var express     = require('express');
var app         = express();
var MongoClient = require('mongodb').MongoClient;
var assert      = require('assert');

app.use(express.static('public'));
app.use(bodyParser.json());

// Connection URL
var url = 'mongodb://localhost:27017/fed-exercise-big-panda';

var insertComment = function (db, comment, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert document
    collection.insertOne(
        comment
        , function (err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            callback(result);
        });
};

var findComments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
};

var removeAllDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Delete all documents
    collection.removeMany({}, function (err, result) {
        assert.equal(err, null);
        console.log("Removed all documents");
        callback(result);
    });
};

app.get('/', function (req, res) {
    res.sendFile(path.resolve('./index.html'));
});

app.get('/comments/all', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err != null) {
            return res.status(400).send({
                message : JSON.stringify(err)
            });
        }
        findComments(db, function (docs) {
            db.close();
            res.json(docs);
        })
    });
});

app.post('/comments/new', function (req, res) {
    //validations
    var errorMessage = "";

    //validate email
    if (!validator.isEmail(req.query.email)) {
        errorMessage += 'Please enter valid Email';
    }
    //validate comment
    if (validator.isEmpty(req.query.message)) {
        if (!validator.isEmpty(errorMessage)) {
            errorMessage += ' and valid comment text';
        } else {
            errorMessage = 'Please enter valid comment text';
        }
    }

    //get gravatar
    var emailHash = md5(req.query.email.toLowerCase().trim());

    if (!validator.isEmpty(errorMessage)) {
        return res.status(400).send({
            message : errorMessage
        });
    } else {
        var comment = {
            email    : req.query.email,
            message  : req.query.message,
            gravatar : 'https://www.gravatar.com/avatar/' + emailHash,
            created  : new Date().getTime()
        };

        //insert to DB
        MongoClient.connect(url, function (err, db) {

            if (err != null) {
                return res.status(400).send({
                    message : JSON.stringify(err)
                });
            }

            console.log("inserted to collection");

            insertComment(db, comment, function () {
                db.close();
                return res.status(200).send(comment);
            });
        });
    }

});

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});
