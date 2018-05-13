/*--------------------------
routing search
---------------------------*/

var express = require("express");
var router = express.Router();
var Entry = require("../models/entry");

// Define escapeRegex function for search feature
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/", function(req, res) {

	// Get all entries from DB
	Entry.find({})
		.sort({ createdAt: -1 })
		.exec(function(err, allEntries) {
			if (err) {
				console.log(err);
			} else {
				
				res.render("entries/index", { entries: allEntries, page: 'entries' });
			}
		});


});

//route for query
router.get("/query", function(req, res) {
	if (req.query.name && req.xhr) {
		const regex = new RegExp(escapeRegex(req.query.name), 'gi');
		// Get all entries from DB
		Entry.find({ name: regex }, function(err, allEntries) {
			if (err) {
				console.log(err);
			} else {
				res.status(200).json(allEntries);
			}
		});
	} else {
		// Get all entries from DB
		Entry.find({})
			.sort({ createdAt: -1 })
			.exec(function(err, allEntries) {
				if (err) {
					console.log(err);
				} else {
					if (req.xhr) {
						res.json(allEntries);
					} else {
						res.redirect("/search");
					}
				}
			});
	}
});


module.exports = router;