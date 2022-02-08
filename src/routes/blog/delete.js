const express = require("express")
const Blog = require("../../models/Blog")
const UserAuth = require("../../middlewares/user_token_auth")
const Router = express.Router()

Router.delete("/blog/delete", UserAuth, async (req, res, next) => {
    try {
        const body = req.body

        const blog_id = body["blog_id"]

        if (!blog_id)
            return res.status(400).send({
                error: "400-blogIdRequired"
            })

        const blog = await Blog.findById(blog_id).exec()
        if (!blog)
            return res.status(404).send({
                error: "404-blogNotFound"
            })

        if (blog["author"].toString() !== req.user["_id"].toString())
            return res.status(403).send({
                error: "403-noOwnership"
            })

        await Blog.findOneAndRemove({ _id: blog_id }).exec()
        req.user["blogs_posted"] = req.user["blogs_posted"].filter(blog_posted => blog_posted.toString() !== blog_id.toString())
        await req.user.save()

        return res.status(200).send({
            result: null
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorText: JSON.stringify(e)
        })
    }
})

module.exports = Router