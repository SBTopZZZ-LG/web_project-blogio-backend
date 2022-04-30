const express = require("express")
const Blog = require("../../models/Blog")
const Router = express.Router()

Router.get("/blog/search", async (req, res, next) => {
    try {
        const queries = req.query

        var query = queries["query"]

        if (!query)
            return res.status(400).send({
                error: "400-queryRequired"
            })

        // Disable special chars
        query = query.split(/\!/).join("\\!")
        query = query.split(/\./).join("\\.")
        query = query.split(/\$/).join("\\$")
        query = query.split(/\^/).join("\\^")
        query = query.split(/\*/).join("\\*")
        query = query.split(/\(/).join("\\(")
        query = query.split(/\)/).join("\\)")
        query = query.split(/\[/).join("\\[")
        query = query.split(/\]/).join("\\]")
        query = query.split(/\-/).join("\\-")
        query = query.split(/\+/).join("\\+")
        query = query.split(/\?/).join("\\?")

        return res.status(200).send({
            result: {
                blogs: (await Blog.find({ title: { $regex: query, $options: "i" } }, "_id").sort({ posted_at: "desc" }).exec()).map(blog => blog["_id"])
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorText: JSON.stringify(e)
        })
    }
})

Router.get("/blog/search/v2", async (req, res, next) => {
    try {
        const queries = req.query

        var query = queries["query"]

        if (!query)
            return res.status(400).send({
                error: "400-queryRequired"
            })

        // Disable special chars
        query = query.split(/\!/).join("\\!")
        query = query.split(/\./).join("\\.")
        query = query.split(/\$/).join("\\$")
        query = query.split(/\^/).join("\\^")
        query = query.split(/\*/).join("\\*")
        query = query.split(/\(/).join("\\(")
        query = query.split(/\)/).join("\\)")
        query = query.split(/\[/).join("\\[")
        query = query.split(/\]/).join("\\]")
        query = query.split(/\-/).join("\\-")
        query = query.split(/\+/).join("\\+")
        query = query.split(/\?/).join("\\?")

        return res.status(200).send({
            result: {
                blogs: await Blog.find({ title: { $regex: query, $options: "i" } }).sort({ posted_at: "desc" }).exec()
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorText: JSON.stringify(e)
        })
    }
})

module.exports = Router