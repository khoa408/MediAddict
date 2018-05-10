var express = require("express");
var router = express.Router({ mergeParams: true });
var Entry = require("../models/entry");
var RecComment = require("../models/recComment");
var middleware = require("../middleware");
var ManRec = require("../models/manRec");
var ObjectId = require("mongodb").ObjectID;

//reviews New
// router.get("/", function(req,res){
//   res.redirect("/search");
// });

router.get("/", middleware.isLoggedIn, function(req, res) {
    res.redirect("/entry/" + req.params.id);
});

router.get("/new", middleware.isLoggedIn, function(req, res) {
    
    if(!ObjectId.isValid(req.params.id)){
        return res.redirect("/search");
    }
    var testId = new ObjectId(req.params.id);

    if(testId != req.params.id){
        return res.redirect("/search");
    };
        
   // console.log(req.params.id);
    Entry.findById(req.params.id, function(err, entry) {
        if (err) {
            console.log(err);
        } else {

            res.render("recComments/new", { entry: entry });
        }
    })
    // res.redirect("/search");
});

pushToRManRec = function(manRec, recComment, callback) {

    recComment.manRec = manRec.id;
    recComment.save();
    manRec.count++;
    manRec.recCommentList.push(recComment);
    manRec.save();
    //console.log(recComment);

}

linkRecComment = function(manRec, recComment, entry, targetID, callback) {

    console.log(manRec);
    if (typeof manRec === "undefined") {
        //new manRec
        newManRec = {
            recEntry_id: entry.id,
            targetEntry_id: targetID
        }

        ManRec.create(newManRec, function(err, newManRec) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            entry.manRecList.push(newManRec);
            entry.save();
            pushToRManRec(newManRec, recComment);
            
            //console.log(recComment);                                
        });

    } else {
        pushToRManRec(manRec, recComment);
    }

    recComment.save();
    console.log(entry._id);
    entry.recCommentList.push(recComment);
    entry.save();
    return callback();
}
//reviews Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    if(req.params.id == req.body.target_id){
      req.flash('error', 'You cannot recommend the entry to itself.')
      return res.redirect("/entry/" + req.params.id+"/recommendations/new/");  
    }


    if(!ObjectId.isValid(req.body.target_id)){
      req.flash('error', 'Invalid recommendation')
      return res.redirect("/entry/" + req.params.id+"/recommendations/new/");  
    }
    var testId = new ObjectId(req.body.target_id);

    if(testId != req.body.target_id){
      req.flash('error', 'Invalid recommendation')
      return res.redirect("/entry/" + req.params.id+"/recommendations/new/");  
    };

    // if(!(new ObjerctId req.params.id instanceof ObjectID))
    // {
    //      req.flash("error", "Invalid recommendation.")
    //       return res.redirect("/entry/" + req.params.id+"/recommendations/new/")
    // }
    //lookup entry using ID
    Entry.findById(req.params.id)
        .populate({
            path: "manRecList",
            match: { targetEntry_id: req.body.target_id }
        })
        .populate({
            path: "recCommentList",
            match: { 
                "target.id": req.body.target_id, 
                "author.id": req.user._id
            }
        })
        .exec(function(err, entry) {
            if (err) {
                console.log(err);
                return res.redirect("/search");
            }

            //varify no existing recommendation
           // var count = 0;
            // for(var i = 0; i < entry.recCommentList.length && count ===0; i++ ){
            //   if(entry.recCommentList[i].author.id.toString() == req.user._id){
            //     count++;
            //   }
            // }
            console.log(entry.recCommentList.length);
            if(entry.recCommentList.length !==0){
              req.flash("error", "You have already recommended this before to the same entry.")
              return res.redirect("/entry/" + req.params.id+"/recommendations/new/")
            }
            //varify target
            Entry.findById(req.body.target_id, function(err, target) {
                if (err) {
                    console.log(err);
                    req.flash("Sorry, an error occurred.");
                    return res.redirect("/search");
                }

                //return console.log(target);
                if (typeof target === "undefined") {
                    console.log(err);
                    req.flash("Sorry, an error occurred.");
                    return res.redirect("/search");
                }

                var newRecComment = {
                    entry_id: entry._id,
                    "target.name": target.name,
                    "target.id": target._id,
                    "author.id": req.user._id,
                    "author.username": req.user.username,

                };
                //console.log(entry);
                RecComment.create(newRecComment, function(err, recComment) {
                    if (err) {
                        return console.log(err);
                        req.flash("Sorry, an error occurred.");
                        return res.redirect("/entry/" + req.params.id);

                    }


                    linkRecComment(entry.manRecList[0], recComment, entry, target.id, function(err) {
                        if (err) {
                            req.flash('error', "Sorry, your recommendation was not successful. Please try again.")
                        } else {
                            req.flash('success', 'Created a recommendation!')
                        };
                        return res.redirect('/entry/' + entry._id);
                    })
                });
            });
        });
});


// router.get("/:reviewId/edit", middleware.isLoggedIn, function(req, res){
//     // find entry by id
//     Review.findById(req.params.reviewId, function(err, review){
//         if(err){
//             console.log(err);
//         } else {
//              res.render("review/edit", {entry_id: req.params.id, review: review});
//         }
//     })
// });

module.exports = router;