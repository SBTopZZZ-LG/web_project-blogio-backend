const express = require("express")
const User = require("../../models/User")
const UserAuth = require("../../middlewares/user_token_auth")
const Router = express.Router()

Router.get("/user", async (req, res, next) => {
    try {
        const queries = req.query

        const id = queries["id"]
        const email = queries["email"]

        if (!id && !email)
            return res.status(400).send({
                error: "400-idOrEmailRequired"
            })

        var user = null
        if (id)
            user = await User.findById(id).exec()
        else
            user = await User.findOne({ email }).exec()

        if (!user)
            return res.status(404).send({
                error: "404-userNotFound"
            })

        // Delete sensitive fields
        user["hash"] = null
        user["login_tokens"] = null
        return res.status(200).send({
            result: {
                user
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorInfo: JSON.stringify(e)
        })
    }
})
Router.post("/user/get", UserAuth, async (req, res, next) => {
    try {
        // Delete sensitive fields
        req.user["hash"] = null
        return res.status(200).send({
            result: {
                user: req.user
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