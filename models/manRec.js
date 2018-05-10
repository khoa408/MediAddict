var mongoose = require("mongoose");

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
    count:{type: Number, default: 0}
});

module.exports = mongoose.model("ManRec", manRecSchema);