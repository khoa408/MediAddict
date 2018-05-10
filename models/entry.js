var mongoose = require("mongoose");
var entrySchema = new mongoose.Schema({
    createdAt: { type: Date, default: Date.now },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Type"
        },
        name: {
            type: String,
            required: true
        },
    },
    name: { type: String, required: true },
    image: { type: String, required: true },

    description: String,

    detailList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Detail"
    }],

    reviewList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    manRecList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ManRec"
    }],
    recCommentList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RecComment"
    }]
    

});

module.exports = mongoose.model("Entry", entrySchema);