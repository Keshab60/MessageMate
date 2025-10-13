const mongoose = require("mongoose")
const messageSchema = new mongoose.Schema({
    chatId: { type: String, required: true }, // link to chat
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    Edited: { type: String, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);

