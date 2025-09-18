import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    userID :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    // Keep legacy capitalized field for backward compatibility
    Source : {
        type : String,
        enum : ["Calendar", "Gmail", "Calender"],
        required : false
    },
    // Add canonical lowercase field to match incoming data
    source : {
        type : String,
        enum : ["Calendar", "Gmail", "Calender"],
        required : true
    },
    deadline : {
        type : Date,
        required : true
    },
    priority : {
        type : String,
        enum : ["High", "Low", "Medium"],
        required : true
    },
    status : {
        type :String,
        required : true
    },
    action : {
        type : String
    }
    
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);