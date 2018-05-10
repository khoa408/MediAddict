var express = require("express");
var router = express.Router();
var Entry = require("../models/entry");
var Comment = require("../models/comment");
var Detail = require("../models/detail");
var middleware = require("../middleware");
var ObjectId = require('mongoose').Types.ObjectId;
var Type = require("../models/type");
var Review = require("../models/review");
var manRec = require("../models/manRec");

function round(number, precision) {
    var shift = function(number, precision) {
        var numArray = ("" + number).split("e");
        return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + precision) : precision));
    };
    return shift(Math.round(shift(number, +precision)), -precision);
}





router.get("/", function(req, res) {
    res.redirect("/search");
});

//display page
router.get("/:id", function(req, res) {
    Entry.findById(req.params.id)
        .populate("detailList")
        .populate({
            path: "reviewList",
            options: { sort: { 'createdAt': -1 } }
        })
        .populate({
            path: "recCommentList",
            options: { sort: { 'createdAt': -1 } }
        })
        .populate("type.id")
        .populate({
            path: "manRecList",
            options: { sort: { 'count': -1 } },
            populate: {
                path: 'targetEntry_id',
                model: 'Entry'
            }
        })
        .exec(function(err, foundEntry) {
            if (!foundEntry) {
                req.flash("error", "Page does not exist.");
                return res.redirect("/search");
            }
            // console.log(foundEntry);
            var rating = -1;
            if (foundEntry.reviewList.length != 0) {
                var sum = 0;
                for (let review of foundEntry.reviewList) {
                    sum += review.rating;
                }
                rating = round((sum / foundEntry.reviewList.length), 1);
                //console.log(sum);
            }
            // if (err) {
            //     console.log(err);
            // } else {
            //     //console.log(foundEntry)
            //     //calculate average rating
            //     Review.aggregate([{
            //             "$match": {
            //                 "entry_id": ObjectId(req.params.id)
            //             },
            //         },
            //         {
            //             $group: {
            //                 _id: '$entry_id',
            //                 ratingAvg: { $avg: '$rating' }
            //             }
            //         }
            //     ]).exec(function(err, aggResult) {
            //         var rating;

            //         //set up rating if present
            //         if (aggResult.length) {
            //             rating = aggResult[0].ratingAvg.toFixed(1);;
            //         }
            Type.find({}).exec(function(err, typeList){
              console.log(typeList);
            res.render("entries/display", { entry: foundEntry, rating: rating, recCommentList: foundEntry.recCommentList, manRecList: foundEntry.manRecList, typeList:typeList });
            //       });
            });
        });
});

// //INDEX - show all entries
// router.get("/search", function(req, res) {
//     if (req.query.search && req.xhr) {
//         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//         // Get all entries from DB
//         Entry.find({ name: regex }, function(err, allEntries) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 res.status(200).json(allEntries);
//             }
//         });
//     } else {
//         // Get all entries from DB
//         Entry.find({}, function(err, allEntries) {
//             if (err) {
//                 console.log(err);
//             } else {
//                 if (req.xhr) {
//                     res.json(allEntries);
//                 } else {
//                     res.render("entries/index", { entries: allEntries, page: 'entries' });
//                 }
//             }
//         });
//     }
// });

// //CREATE - add new entry to DB
// router.post("/search", middleware.isLoggedIn, function(req, res) {
//     // get data from form and add to entries array
//     var name = req.body.name;
//     var image = req.body.image;
//     var desc = req.body.description;
//     var author = {
//         id: ObjectId(req.user._id),
//         username: req.user.username
//     }

//     var newEntry = {
//         name: name,
//         image: image,
//         description: desc,
//         author: author
//     };
//     // Create a new entry and save to DB
//     Entry.create(newEntry, function(err, newlyCreated) {
//         if (err) {
//             console.log(err);
//         } else {
//             //redirect back to entries page
//             console.log(newlyCreated);
//             res.redirect("/search");
//         }

//     });
// });

//NEW - show form to create new entry
router.get("/new", middleware.isLoggedIn, function(req, res) {
    // res.render("entries/new"); 
    res.redirect("/new-entry")
});

// // SHOW - shows more info about one entry
// router.get("/:id", function(req, res) {
//     //find the entry with provided ID
//     Entry.findById(req.params.id).populate("comments").exec(function(err, foundEntry) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(foundEntry)
//             //render show template with that entry
//             res.render("entries/show", { entry: foundEntry });
//         }
//     });
// });

// router.get("/:id/edit", middleware.checkUserEntry, function(req, res) {
//     //find the entry with provided ID
//     Entry.findById(req.params.id, function(err, foundEntry) {
//         if (err) {
//             console.log(err);
//         } else {
//             //render show template with that entry
//             res.render("entries/edit", { entry: foundEntry });
//         }
//     });
// });

// router.put("/:id", function(req, res) {

//     var newData = {
//         name: req.body.name,
//         image: req.body.image,
//         description: req.body.description,
//     };

//     Entry.findByIdAndUpdate(req.params.id, { $set: newData }, function(err, entry) {
//         if (err) {
//             req.flash("error", err.message);
//             res.redirect("back");
//         } else {
//             req.flash("success", "Successfully Updated!");
//             res.redirect("/entry/" + entry._id);
//         }
//     });
// });

// router.delete("/:id", function(req, res) {
//     Entry.findByIdAndRemove(req.params.id, function(err, entry) {
//         Comment.remove({
//             _id: {
//                 $in: entry.comments
//             }
//         }, function(err, comments) {
//             req.flash('error', entry.name + ' deleted!');
//             res.redirect('/search');
//         })
//     });
// });


module.exports = router;