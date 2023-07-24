const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    },
    verify: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model("users", userSchema)

module.exports = User