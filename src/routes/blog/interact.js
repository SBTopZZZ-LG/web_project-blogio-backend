const express = require("express")
const Blog = require("../../models/Blog")
const UserAuth = require("../../middlewares/user_token_auth")
const Router = express.Router()

Router.post("/blog/like", UserAuth, async (req, res, next) => {
    try {
        const body = req.body

        const blog_id = body["blog_id"]

        if (!blog_id)
            return res.status(400).send({
                error: "400-blogIdRequired"
            })

        var blog = await Blog.findById(blog_id).exec()
        if (!blog)
            return res.status(404).send({
                error: "404-blogNotFound"
            })

        if (blog["likes"].includes(req.user["_id"]))
            return res.status(403).send({
                error: "403-alreadyLiked"
            })

        blog["likes"].push(req.user["_id"])
        blog["like_count"]++
        await blog.save()

        return res.status(200).send({
            result: {
                blog
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorText: JSON.stringify(e)
        })
    }
})
Router.post("/blog/dislike", UserAuth, async (req, res, next) => {
    try {
        const body = req.body

        const blog_id = body["blog_id"]

        if (!blog_id)
            return res.status(400).send({
                error: "400-blogIdRequired"
            })

        var blog = await Blog.findById(blog_id).exec()
        if (!blog)
            return res.status(404).send({
                error: "404-blogNotFound"
            })

        if (!blog["likes"].includes(req.user["_id"]))
            return res.status(403).send({
                error: "403-notLiked"
            })

        blog["likes"] = blog["likes"].filter(liker => liker.toString() !== req.user["_id"].toString())
        blog["like_count"]--
        await blog.save()

        return res.status(200).send({
            result: {
                blog
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