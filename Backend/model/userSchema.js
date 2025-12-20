const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName:{
        type: String,
        trim: true,
        require: true,
    },
    lastName:{
         type: String,
        trim: true,
        require: true,
    },
    email:{
       type: String,
        trim: true,
        require: true,
    },
    password:{
        type: String,
        require: true,
    },
    verified: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model("userList",userSchema)
