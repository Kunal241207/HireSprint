const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        unique: [true, "account already exists with this email address"],
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required: true,
    }
})

const userModel = mongoose.model("users", userSchema)

module.exports = userModel