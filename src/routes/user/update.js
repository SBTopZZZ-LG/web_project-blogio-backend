const express = require("express")
const jwt = require("jsonwebtoken")
const UserAuth = require("../../middlewares/user_token_auth")
const User = require("../../models/User")
const Router = express.Router()

Router.post("/user", UserAuth, async (req, res, next) => {
    try {
        const body = req.body

        const newData = body["newData"]

        if (!newData)
            return res.status(400).send({
                error: "400-newDataRequired"
            })

        const username = newData["username"]
        const email = newData["email"]
        const password = newData["password"]
        const bio = newData["bio"]

        if (username)
            req.user["username"] = username
        if (email) {
            if (!/[a-z0-9\._]+@[a-z0-9\._]+/.test(email))
                return res.status(400).send({
                    error: "400-malformedEmail"
                })

            if (await User.findOne({ email }).exec())
                return res.status(403).send({
                    error: "403-emailAlreadyInEmail"
                })

            req.user["email"] = email
        }
        if (password) {
            if (password.length < 6 || password.length > 16)
                return res.status(400).send({
                    error: "400-passwordTooShortOrTooLong"
                })

            req.user["hash"] = jwt.sign(password, "webprojectsecret")
        }
        if (bio)
            req.user["bio"] = bio

        if (username || email || password || bio)
            await req.user.save()

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
            errorInfo: JSON.stringify(e)
        })
    }
})

module.exports = Router