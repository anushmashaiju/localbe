const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        min: 3,
        max: 20, 
        unique: true
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
   
    profilePicture: {
        type: String,
        default: ""
    },

    password:{
        type:String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    description: {
        type: String,
        max: 50
    },
    location: {
        type: String,
        max: 50
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema)