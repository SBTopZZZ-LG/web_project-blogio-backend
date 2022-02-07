const mongoose = require("mongoose")
const Schema = mongoose.Schema

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: "Blogger"
    },
    hash: {
        type: String,
        required: true
    },
    blogs_posted: {
        type: Array,
        default: []
    },
    login_tokens: {
        type: Array,
        default: []
    }
})

module.exports = mongoose.model("Users", schema)