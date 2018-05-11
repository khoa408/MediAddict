var mongoose = require("mongoose");

var reviewSchema = mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
	entry_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Entry",
		required: true
	},
	comment: String,
	rating: { type: Number, min: 0, max: 5 },
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Review", reviewSchema);