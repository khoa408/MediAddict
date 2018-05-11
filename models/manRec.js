var mongoose = require("mongoose");

//association class between an entry and the other entry that is being recommended to

var manRecSchema = mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
	recEntry_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Entry",
		required: true
	},
	targetEntry_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Entry",
		required: true
	},
	recCommentList: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "RecComment"
	}],
	count: { type: Number, default: 0 }
});

module.exports = mongoose.model("ManRec", manRecSchema);