require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("mongodb connected successfully"))
    .catch(err => console.log("mongodb is not connected", err))

const model = new mongoose.Schema({

    email: { type: String, required: true },
    text: { type: String, required: true },
    name: { type: String, required: true },
    Otp: { type: Number },
    OtpExpiry: { type: Number }

})
module.exports = mongoose.model("keshablog", model);