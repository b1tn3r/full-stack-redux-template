var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
mongoose.Promise = require('bluebird');
var assert = require('assert');
var config = require('../server/config');



mongoose.connect(config.mongodbUri + '/testDatabase');
var Schema = mongoose.Schema;

var contestsSchema = new Schema({
    categoryName: {type: String, required: true},
    contestName: {type: String, required: true},
    nameIds: {type: Array, required: false}
});

var Contests = mongoose.model('Contests', contestsSchema);


router.get('/contests', function(req, res, next) {
    var contests = {};

    Contests.find({}, ['categoryName', 'contestName', 'description', 'nameIds'],
        {sort: {contestName: 1}}
    ).then((docs) => {

        docs.forEach((contest) => {
            contests[contest._id] = contest;
        });
        return contests;
    }).then((contests) => res.send({ contests: contests })
    ).catch((err) => {
        console.error(err);
        throw err;
    });
});


router.get('/contests/:contestId', function(req, res, next) {
    Contests.findOne({ _id: ObjectId(req.params.contestId) })
        .then((contest) => res.send(contest))
        .catch(console.error);
});



var namesSchema = new Schema({
    name: {type: String, required: true},
    timestamp: {type: Date, default: Date.now(), required: true}
});

var Names = mongoose.model('Names', namesSchema);


router.get('/names/:nameIds', function(req, res, next) {

    const nameIds = req.params.nameIds.split(',').map(ObjectId);

    var names = {};
    Names.find({ _id: { $in: nameIds } })
        .then((docs) => {
            docs.forEach((name) => {
                names[name._id] = name;
            });
            return names;
        }).then((names) => res.send({ names: names })
    ).catch((err) => {
        console.error(err);
        throw err;
    });
});




router.post('/names', function(req, res, next) {
    const contestId = ObjectId(req.body.contestId);
    const newName = req.body.newName;

    // Validation Goes Here ...

    var nameObj = { name: newName};

    var nameDoc = new Names(nameObj);
    nameDoc.save((err, name) => {
        errorHandler(err, "Could Not Add Name", 404, next);

        Contests.findById(contestId, function(err, doc) {
            errorHandler(err, "No Contest Entry Found", 404, next);

            doc.nameIds.push(name._id);
            doc.save((err, contest) => {
                errorHandler(err, "Could Not Update Contest", 500, next);

                res.send({
                    updatedContest: contest,
                    newName: { _id: name._id, name: newName }
                });
            });
        });
    });
});
function errorHandler(err, message, status, next) {
    if(err) {
        err.message = message + ": " + err.message;
        err.status = status;
        console.error(err);
        next(err);
    }
}


module.exports = router;