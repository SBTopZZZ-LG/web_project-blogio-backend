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
    likes: {
        type: Object,
        default: {}
    },
    posted_at: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model("Blogs", schema)