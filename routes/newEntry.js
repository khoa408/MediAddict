var express = require("express");
var router = express.Router({ mergeParams: true });
var Type = require("../models/type");
var Detail = require("../models/detail");
var Entry = require("../models/entry")
var middleware = require("../middleware");

router.get("/", middleware.isLoggedIn, function(req, res) {

    //find list of types
    Type.find({}, function(err, allTypes) {
        if (err) {
            console.log(err);
        } else {
            var typeNames = [];
            for (const type of allTypes) {
                typeNames.push(type.name);
            }

            res.render("entries/new", { Type: typeNames });
            //console.log(typeNames);
        }
    }).sort({
        "name": 1.0
    });
});

router.post("/", middleware.isLoggedIn, function(req, res) {

    var typeName = req.body.type.toLowerCase();
    //console.log(typeName.toLowerCase());

    //find specific type object by name
    Type.findOne({ "name": typeName }, function(err, typeEntry) {
        if (err) {
            console.log(err);
        } else {
            console.log(typeEntry.name);

            //bring fieldList to front end
            res.render("entries/new-details", { typeName: typeName, fieldList: typeEntry.fieldList });
        }
    });
});

router.post("/submit", middleware.isLoggedIn, function(req, res) {
    // get data from form and add to entries array
    var typeEntry = null;

    Type.findOne({ "name": req.body.type }, function(err, type) {
        if (err) { return console.log(err); }

        typeEntry = type;
        // console.log(type);


        //console.log(typeEntry);

        if (!typeEntry) {
            console.log("no type found");
            req.flash("error", "Unable to create new entry.");
            return res.redirect("/");
        }

        //get data from rq

        var author = req.user._id;

        var type = {
            id: typeEntry._id,
            name: typeEntry.name
        };

        //get commmon variables 
        var name = req.body.name;
        var image = req.body.image;
        var desc = req.body.description;

        //set up new object
        var newEntry = {
            name: name,
            image: image,
            description: desc,
            author: author,
            type: type,
        };



        // Create a new entry and save to DB
        Entry.create(newEntry, function(err, newlyCreated) {
            if (err) {

                console.log(err);
                req.flash("error", "Unable to create new entry.");
                return res.redirect("/");
            }

            //store info for each field in type
            for (const fieldName of typeEntry.fieldList) {

                //re-obtain object to fix saving bug
                Entry.findById(newlyCreated._id).exec(function(err, entry) {

                    //set up field content
                    var content = req.body[fieldName];

                    //create new detail object if field content is not empty
                    if (content !== "") {
                        var newDetail = {
                            field: fieldName,
                            content: content,
                            entry_id: newlyCreated._id
                        };

                        //create detail object
                        Detail.create(newDetail, function(err, detail) {
                            if (err) { return console.log(err); }

                            //push detail object id back to entry detailList
                            entry.detailList.push(detail._id);
                            entry.save(function() {

                            });

                        });

                    }

                });

            };
            Entry.findById(newlyCreated._id).exec(function(err, entry) {
                console.log(entry);
            });

        });


        res.redirect("/search");
    });
});

module.exports = router;