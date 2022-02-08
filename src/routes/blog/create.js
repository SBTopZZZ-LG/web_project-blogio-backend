const express = require("express")
const Blog = require("../../models/Blog")
const UserAuth = require("../../middlewares/user_token_auth")
const Router = express.Router()

Router.post("/blog/create", UserAuth, async (req, res, next) => {
    try {
        const body = req.body

        const blog = body["blog"]

        if (!blog)
            return res.status(400).send({
                error: "blogRequired"
            })

        const title = blog["title"]
        const blog_body = blog["body"]
        const posted_at = blog["posted_at"]

        if (!title || !blog_body || !posted_at)
            return res.status(400).send({
                error: "400-titleAndOrBodyAndOrPostedAtMissing"
            })

        if (title.trim().length == 0)
            return res.status(400).send({
                error: "400-invalidTitle"
            })
        if (blog_body.trim().length == 0)
            return res.status(400).send({
                error: "400-invalidBody"
            })

        const blog_obj = new Blog({
            author: req.user["_id"],
            title,
            body: blog_body,
            posted_at: new Date(posted_at)
        })
        await blog_obj.save()

        req.user["blogs_posted"].push(blog_obj["_id"])
        await req.user.save()

        return res.status(200).send({
            result: {
                blog: blog_obj
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