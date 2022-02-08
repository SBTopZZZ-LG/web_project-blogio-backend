const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
    author: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    like_count: {
        type: Number,
        default: 0
    },
    likes: {
        type: Array,
        default: []
    },
    posted_at: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Blogs", schema)