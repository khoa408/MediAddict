/*--------------------------
routing entry reviews
---------------------------*/

var express = require("express");
var router = express.Router({ mergeParams: true });
var Entry = require("../models/entry");
var Review = require("../models/review");
var middleware = require("../middleware");
var ObjectId = require("mongodb").ObjectID;


router.get("/", middleware.isLoggedIn, function(req, res) {
	res.redirect("/entry/" + req.params.id);
});

//reviews New
router.get("/new", middleware.isLoggedIn, function(req, res) {


	Entry.findById(req.params.id, function(err, entry) {
		if (err) {
			console.log(err);
			return res.redirect("/search");
		}

		//validate entry existance
		if (typeof entry == "undefined") {
			return res.redirect("/search");

		}
		res.render("reviews/new", { entry: entry });


	})
});

//reviews Create
router.post("/", middleware.isLoggedIn, function(req, res) {
	//lookup entry using ID



	Entry.findById(req.params.id)
		.populate({
			path: "reviewList",
			match: {
				"author.id": req.user._id
			}
		})
		.exec(function(err, entry) {

			if (err) {
				console.log(err);
				return res.redirect("/search");
			}

			//check if review already exist
			if (entry.reviewList.length !== 0) {
				req.flash("error", "Cannot post review because You have already reviewed this.");
				return res.redirect("/entry/" + req.params.id);
			}

			//prepare new object for review
			var newReview = {
				rating: req.body.rating,
				comment: req.body.comment,
				entry_id: req.params.id
			}

			//create new review
			Review.create(newReview, function(err, review) {
				if (err) {
					console.log(err);
				} else {
					//add username and id to review
					review.author.id = req.user._id;
					review.author.username = req.user.username;

					review.save();
					console.log(entry._id);
					entry.reviewList.push(review);
					entry.save();
					console.log(review);
					req.flash('success', 'Created a review!');
					return res.redirect('/entry/' + entry._id);
				}
			});

		});
});

module.exports = router;