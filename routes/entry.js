/*--------------------------
routing entries
---------------------------*/

var express = require("express");
var router = express.Router();
var Entry = require("../models/entry");
var Detail = require("../models/detail");
var middleware = require("../middleware");
var ObjectId = require('mongoose').Types.ObjectId;
var Type = require("../models/type");
var Review = require("../models/review");
var manRec = require("../models/manRec");

//round off number to one decimal point if not whole number
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


router.get("/new", middleware.isLoggedIn, function(req, res) {
	// res.render("entries/new"); 
	res.redirect("/new-entry")
});


//display entry page
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

			// calculate average rating
			//replacing the aggregation method so that it is only searching the populated reviews

			var rating = -1;
			if (foundEntry.reviewList.length != 0) {
				var sum = 0;
				for (let review of foundEntry.reviewList) {
					sum += review.rating;
				}
				rating = round((sum / foundEntry.reviewList.length), 1);
			}

			Type.find({}).exec(function(err, typeList) {
				console.log(typeList);
				res.render("entries/display", { entry: foundEntry, rating: rating, recCommentList: foundEntry.recCommentList, manRecList: foundEntry.manRecList, typeList: typeList });

			});
		});
});




module.exports = router;