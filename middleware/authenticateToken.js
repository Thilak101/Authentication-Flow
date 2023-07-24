const jwt = require("jsonwebtoken")
const { User } = require("../model")

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.params.token
        if (!token) {
            return res.json({ msg: "Access Denied" })
        }
        else {
            const data = await jwt.verify(token, process.env.SECRET_KEY)
            if (data) {
                await User.findByIdAndUpdate(data.user1._id, { verify: true })
                console.log(data.user1._id)
                next()
            }
            else {
                return res.send("enter correct email or password")
            }

        }


    }
    catch (err) {
        return res.json({ msg: err.message })
    }
}

module.exports = authenticateToken