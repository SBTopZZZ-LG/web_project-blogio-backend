const express = require("express")
const Blog = require("../../models/Blog")
const UserAuth = require("../../middlewares/user_token_auth")
const Router = express.Router()

Router.get("/blog/one", async (req, res, next) => {
    try {
        const queries = req.query

        const id = queries["id"]

        if (!id)
            return res.status(400).send({
                error: "400-idRequired"
            })

        const blog = await Blog.findById(id).exec()
        if (!blog)
            return res.status(404).send({
                error: "404-blogNotFound"
            })

        return res.status(200).send({
            result: {
                blog
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalException",
            errorText: JSON.stringify(e)
        })
    }
})
Router.get("/blog", async (req, res, next) => {
    try {
        return res.status(200).send({
            result: {
                blogs: (await Blog.find({}, "_id").sort({ like_count: "desc" }).exec()).map(blog => blog["_id"])
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorText: JSON.stringify(e)
        })
    }
})
Router.get("/blog/last24hrs", async (req, res, next) => {
    try {
        var offset = Date.now() - 24 * 60 * 60 * 1000

        return res.status(200).send({
            result: {
                blogs: (await Blog.find({}, "_id").where('posted_at').gt(offset).sort({ like_count: "desc" }).exec()).map(blog => blog["_id"])
            }
        })
    } catch (e) {
        return res.status(200).send({
            error: "500-internalError",
            errorText: JSON.stringify(e)
        })
    }
})
Router.post("/blog/liked", UserAuth, async (req, res, next) => {
    try {
        return res.status(200).send({
            result: {
                blogs: (await Blog.find({ likes: req.user["_id"] }, "_id").sort({ like_count: "desc" }).exec()).map(blog => blog["_id"])
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