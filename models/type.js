var mongoose = require("mongoose");

var typeSchema = new mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: {type:String, unique: true, required: true},
	fieldList: [String],
	fontAweIcon: String
});

module.exports = mongoose.model("Type", typeSchema);