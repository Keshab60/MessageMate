const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/keshabooooo")
    .then(() => console.log("mongodb connected successfully"))
    .catch(err => console.log("mongodb is not connected", err))

const model = new mongoose.Schema({

    email: { type: String, required: true },
    text: { type: String, required: true },
    Otp:{type:Number},
    OtpExpiry:{type:Number}

})
 module.exports=mongoose.model("keshablog",model);