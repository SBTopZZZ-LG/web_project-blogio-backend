const express = require("express")
const User = require("../../models/User")
const UserAuth = require("../../middlewares/user_token_auth")
const Router = express.Router()

Router.post("/user/signOut", UserAuth, async (req, res, next) => {
    try {
        const headers = req.headers

        const login_token = headers["authorization"] // not null

        if (!req.user["login_tokens"].includes(login_token))
            return res.status(403).send({
                error: "403-invalidLoginToken"
            })

        req.user["login_tokens"] = req.user["login_tokens"].filter(_login_token => _login_token !== login_token)
        await req.user.save()

        return res.status(200).send({
            result: null
        })
    } catch (e) {
        return res.status(500).send({
            error: "500-internalException",
            errorInfo: JSON.stringify(e)
        })
    }
})

module.exports = Router