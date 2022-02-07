const User = require("../models/User")

module.exports = async (req, res, next) => {
    try {
        const headers = req.headers
        const body = req.body

        const login_token = headers["authorization"]
        const email = body["email"]

        if (!login_token || !email)
            return res.status(400).send({
                error: "400-loginTokenOrEmailMissing"
            })

        if (!/[a-z0-9\._]+@[a-z0-9\._]+/.test(email))
            return res.status(400).send({
                error: "400-malformedEmail"
            })

        const user = await User.findOne({ email }).exec()
        if (!user)
            return res.status(404).send({
                error: "404-userNotFound"
            })

        if (!user["login_tokens"].includes(login_token))
            return res.status(403).send({
                error: "403-invalidLoginToken"
            })

        req.user = user

        return next()
    } catch (e) {
        return res.status(500).send({
            error: "500-internalError",
            errorInfo: JSON.stringify(e)
        })
    }
}