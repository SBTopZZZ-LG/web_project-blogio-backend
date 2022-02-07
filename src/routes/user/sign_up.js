const express = require("express")
const jwt = require("jsonwebtoken")
const User = require("../../models/User")
const Router = express.Router()

Router.post("/user/signUp", async (req, res, next) => {
    try {
        const body = req.body

        const username = body["username"]
        const email = body["email"]
        const password = body["password"]

        if (!username || !email || !password)
            return res.status(400).send({
                error: "400-usernameOrEmailOrPasswordMissing"
            })

        if (username.trim().length == 0)
            return res.status(400).send({
                error: "400-invalidUsername"
            })
        if (!/[a-z0-9\._]+@[a-z0-9\._]+/.test(email))
            return res.status(400).send({
                error: "400-malformedEmail"
            })
        if (password.length < 6 || password.length > 16)
            return res.status(400).send({
                error: "400-passwordTooShortOrTooLong"
            })

        if (await User.findOne({ email }).exec())
            return res.status(403).send({
                error: "403-emailAlreadyInUse"
            })

        const password_hash = jwt.sign(password, "webprojectsecret")

        const user = new User({
            username,
            email,
            hash: password_hash
        })
        await user.save()

        // Delete sensitive fields before returning
        user["hash"] = null
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

module.exports = Router