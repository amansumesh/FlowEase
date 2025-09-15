import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId :{
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    name : {
        type : String
    },
    profilePic : {
        type : String
    },
    accessToken : {
        type : String
    },
    refreshToken : {
        type : String
    }
},{timestamps : true});

export default mongoose.model("User", userSchema);