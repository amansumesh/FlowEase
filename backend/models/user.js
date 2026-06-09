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
    },
    clientId : {
        type : String
    },
    clientSecret : {
        type : String
    },
    phoneNumber : {
        type: String,
        match: [/^[0-9]{10}$/, "Invalid phone number format"]
    },
    smsNotificationsEnabled: {
        type: Boolean,
        default: false
    },
    googleCalendarSyncEnabled: {
        type: Boolean,
        default: true
    },
    syncFrequency: {
        type: String,
        enum: ["5m", "15m", "1h", "24h"],
        default: "15m"
    }

},{timestamps : true});

export default mongoose.model("User", userSchema);