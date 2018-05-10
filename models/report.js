var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	createdAt: { type: Date, default: Date.now },
    recEntry_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Entry",
        required: true
    },
    reportType: String,
    comment: String,
    author: {
    	id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Report", reportSchema);