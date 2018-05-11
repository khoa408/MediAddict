/*--------------------------
routing entry recommendations
---------------------------*/

var express = require("express");
var router = express.Router({ mergeParams: true });
var Entry = require("../models/entry");
var RecComment = require("../models/recComment");
var middleware = require("../middleware");
var ManRec = require("../models/manRec");
var ObjectId = require("mongodb").ObjectID;



router.get("/", middleware.isLoggedIn, function(req, res) {
	res.redirect("/entry/" + req.params.id);
});

//get page for making recommendation
router.get("/new", middleware.isLoggedIn, function(req, res) {


	//find entry for recommendation
	Entry.findById(req.params.id, function(err, entry) {
		if (err) {
			console.log(err);
			return res.redirect("/search");
		}

		//validate entry existance
		if (typeof entry == "undefined") {
			return res.redirect("/search");

		}
		res.render("recComments/new", { entry: entry });

	})
});


//push and link newly created recComment to appropriate manRec
linkToManRec = function(manRec, recComment, callback) {

	recComment.manRec = manRec.id;
	recComment.save();
	manRec.count++;
	manRec.recCommentList.push(recComment);
	manRec.save();

}

//link recComment with entry and manRec
linkRecComment = function(manRec, recComment, entry, targetID, callback) {

	console.log(manRec);

	//create new manRec if does not exist
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

			//link to the newly created manRec
			linkToManRec(newManRec, recComment);

			//console.log(recComment);                                
		});

	} else {
		//link to the existing manRec
		linkToManRec(manRec, recComment);
	}


	recComment.save();
	console.log(entry._id);

	//push reComment to entry
	entry.recCommentList.push(recComment);
	entry.save();
	return callback();
}


//reviews Create
router.post("/", middleware.isLoggedIn, function(req, res) {

	//restrict recommend to self
	if (req.params.id == req.body.target_id) {
		req.flash('error', 'You cannot recommend the entry to itself.')
		return res.redirect("/entry/" + req.params.id + "/recommendations/new/");
	}

	//validate target_id 
	if (!ObjectId.isValid(req.body.target_id)) {
		req.flash('error', 'Invalid recommendation')
		return res.redirect("/entry/" + req.params.id + "/recommendations/new/");
	}
	var testId = new ObjectId(req.body.target_id);

	if (testId != req.body.target_id) {
		req.flash('error', 'Invalid recommendation')
		return res.redirect("/entry/" + req.params.id + "/recommendations/new/");
	};


	//find entry
	Entry.findById(req.params.id)
		.populate({
			path: "manRecList",
			match: { targetEntry_id: req.body.target_id }
		})

		//populate entry with recommendation of same target by same user
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


			console.log(entry.recCommentList.length);
			if (entry.recCommentList.length !== 0) {
				req.flash("error", "You have already recommended this before to the same entry.")
				return res.redirect("/entry/" + req.params.id + "/recommendations/new/")
			}
			//varify target
			Entry.findById(req.body.target_id, function(err, target) {
				if (err) {
					console.log(err);
					req.flash("Sorry, an error occurred.");
					return res.redirect("/search");
				}

				//validate target
				if (typeof target === "undefined") {
					console.log(err);
					req.flash("Sorry, an error occurred.");
					return res.redirect("/search");
				}

				//prepare object for new recComment
				var newRecComment = {

					//recommendation info
					entry_id: entry._id,
					"target.name": target.name,
					"target.id": target._id,

					//add username and id to recommendation
					"author.id": req.user._id,
					"author.username": req.user.username,

				};

				//create new recComment
				RecComment.create(newRecComment, function(err, recComment) {
					if (err) {
						return console.log(err);
						req.flash("Sorry, an error occurred.");
						return res.redirect("/entry/" + req.params.id);

					}

					//link
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



module.exports = router;