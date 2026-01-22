const mongoose = require("mongoose")
const chatSchema = new mongoose.Schema(
    {
        chatId: { type: String, unique: true },
        senderId: { type: String, required: true },
        receiverId: { type: String, required: true },
        members: {
            type: [String],   // array of user IDs
            required: true,
        },
        Name: { type: String, required: true, },
        Othername: { type: String, default: "unknown" }
    },
);
module.exports = mongoose.model("chathistory", chatSchema);

