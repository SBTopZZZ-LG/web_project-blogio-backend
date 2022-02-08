const express = require("express")
const Blog = require("../../models/Blog")
const UserAuth = require("../../middlewares/user_token_auth")
const Router = express.Router()

Router.patch("/blog/update", UserAuth, async (req, res, next) => {
    try {
        const body = req.body

        const blog_id = body["blog_id"]

        if (!blog_id)
            return res.status(400).send({
                error: "400-blogIdRequired"
            })

        var blog_obj = await Blog.findById(blog_id).exec()
        if (!blog_obj)
            return res.status(404).send({
                error: "404-blogNotFound"
            })

        if (blog_obj["author"].toString() !== req.user["_id"].toString())
            return res.status(403).send({
                error: "403-noOwnership"
            })

        const blog = body["blog"]

        if (!blog)
            return res.status(400).send({
                error: "400-blogRequired"
            })

        const title = blog["title"]
        const blog_body = blog["body"]

        if (title) {
            if (title.trim().length == 0)
                return res.status(400).send({
                    error: "400-invalidTitle"
                })

            blog_obj["title"] = title
        }
        if (blog_body) {
            if (blog_body.trim().length == 0)
                return res.status(400).send({
                    error: "400-invalidBody"
                })

            blog_obj["body"] = blog_body
        }

        if (title || blog_body)
            await blog_obj.save()

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