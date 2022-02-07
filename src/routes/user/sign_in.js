const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../../models/User")
const UserAuth = require("../../middlewares/user_token_auth")
const { v4: uuidv4 } = require("uuid")
const Router = express.Router()

Router.post("/user/signIn", async (req, res, next) => {
    try {
        const body = req.body

        const email = body["email"]
        const password = body["password"]

        if (!email || !password)
            return res.status(400).send({
                error: "400-emailAndOrPasswordMissing"
            })

        if (!/[a-z0-9\._]+@[a-z0-9\._]+/.test(email))
            return res.status(400).send({
                error: "400-malformedEmail"
            })
        if (password.length < 6 || password.length > 16)
            return res.status(400).send({
                error: "400-passwordTooShortOrTooLong"
            })

        const password_hash = jwt.sign(password, "webprojectsecret")

        var user = await User.findOne({ email }).exec()
        if (!user)
            return res.status(404).send({
                error: "404-userNotFound"
            })

        if (user["hash"] !== password_hash)
            return res.status(403).send({
                error: "403-passwordMismatch"
            })

        const login_token = uuidv4()
        user["login_tokens"].push(login_token)
        await user.save()

        return res.status(200).send({
            result: {
                user_id: user["_id"],
                login_token
            }
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorInfo: JSON.stringify(e)
        })
    }
})
Router.post("/user/signInWithLoginToken", UserAuth, async (req, res, next) => {
    try {
        return res.status(200).send({
            result: null
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorInfo: JSON.stringify(e)
        })
    }
})

module.exports = Router