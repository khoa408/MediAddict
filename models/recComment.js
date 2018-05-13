var mongoose = require("mongoose");

//individual recommendation submissions
var recCommentSchema = mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
	manRec: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "ManRec",
		required: false
	},
	reason: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	entry_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Entry",
		required: true
	},

	target: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Entry"
		},
		name: String
	}

});

module.exports = mongoose.model("RecComment", recCommentSchema);