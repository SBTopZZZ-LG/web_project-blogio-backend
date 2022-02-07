require("dotenv").config()

require("./src/scripts/connect_mongoose")
const app = require("./src/scripts/start_express")

// Server status
app.get("/", async (req, res, next) => {
    return res.status(200).send("Server Running!")
})

// Routes
app.use(require("./src/routes/user/get"))
app.use(require("./src/routes/user/sign_in"))
app.use(require("./src/routes/user/sign_out"))
app.use(require("./src/routes/user/sign_up"))
app.use(require("./src/routes/user/update"))