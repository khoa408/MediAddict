var mongoose = require("mongoose");

detailSchema = new mongoose.Schema({
	modifiedAt: { type: Date, default: Date.now },
	field: String,
	content: String,
	entry_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Entry"
	},
});

module.exports = mongoose.model("Detail", detailSchema);