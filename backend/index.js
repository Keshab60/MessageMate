const express = require("express");
const cors = require("cors");
const http = require("http");
const session = require("express-session");
const { Server } = require("socket.io");

const keshab = require("./models/loginschema");
const storechat = require("./models/chatschema");
const message = require("./models/MessageSchema");
const sendEmail = require("./SendEmail");

const app = express();

// Create HTTP server for socket.io
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "https://messagemate-mm5u.onrender.com",
        methods: ["GET", "POST"]
    }
});

app.use(cors({ origin: "https://messagemate-mm5u.onrender.com", credentials: true }));
app.use(express.json());
app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false
}));

// Auth middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    return res.status(401).json({ message: "Unauthorized, please log in" });
}

// Routes
app.get("/", isAuthenticated, (req, res) => {
    res.json({ message: "Hello World" });
});

app.post("/signup", async (req, res) => {
    const { email, text, naming } = req.body;
    const file = new keshab({ email, text, name: naming });
    const otp = Math.floor(100000 + Math.random() * 900000);
    file.Otp = otp;
    file.OtpExpiry = Date.now() + 5 * 60 * 1000;
    await file.save();
    await sendEmail(email, "Test Purpose", `Your OTP: ${otp}`);
    res.json({ message: "Signup successful" });
});

app.post("/login", async (req, res) => {
    const { email, text } = req.body;
    const file = await keshab.findOne({ email, text });
    if (file) {
        req.session.user = file;
        res.json({ message: "Login successfully", id: file._id, email: file.email, name: file.name });
    } else {
        res.json({ message: "Please signup first" });
    }
});




app.put("/update-user/:userid", async (req, res) => {
    const user = await keshab.findByIdAndUpdate(req.params.userid, { $set: { name: req.body.name } }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User updated successfully", user });
});





app.post("/verify-otp", async (req, res) => {
    const { Otp } = req.body;
    const user = await keshab.findOne({ Otp });
    if (!user) return res.status(400).json({ message: "Invalid OTP" });

    if (Date.now() < user.OtpExpiry) {
        user.Otp = null;
        user.OtpExpiry = null;
        await user.save();
        res.status(200).json({ message: "OTP verified", redirect: "/login" });
    } else {
        res.json({ message: "OTP expired, try again" });
    }
});

app.post("/chats", async (req, res) => {
    const userId = req.body.UserID;
    const chat = await storechat.find({ members: userId });
    res.json(chat);
});

app.post("/storechats", async (req, res) => {
    const { UserID, otherchat, Name, senderId } = req.body;

    if (UserID === otherchat) {
        return res.json({ message: "You cannot start a chat with your own UserID." });
    }

    const result = await keshab.findById(otherchat);
    if (!result) {
        return res.json({ message: "User not found" });
    }

    const members = [UserID, otherchat];
    const chatId = members.sort().join("_");

    //Prevent duplicate chats
    const existingChat = await storechat.findOne({ chatId })
    if (existingChat) {
        return res.status(200).json({ message: "Chat already exists", chat: existingChat })
    }

    const chatsave = new storechat({ members, Name, chatId, senderId, receiverId: otherchat })
    await chatsave.save()

    res.status(201).json({ message: "Chat saved successfully", chat: chatsave })
})


app.get("/messages/:chatId", async (req, res) => {
    try {
        const messages = await message.find({ chatId: req.params.chatId });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get("/selectedchat/:chatId", async (req, res) => {
    try {
        const data = await storechat.find({ chatId: req.params.chatId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/message/:msgid", async (req, res) => {
    try {
        const data = await message.findByIdAndUpdate(req.params.msgid, { $set: { text: "🚫 This message was deleted" } })
        res.json({ message: "deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

app.put("/messages/:EditingMessageId", async (req, res) => {
    try {

        const data = await message.findByIdAndUpdate(req.params.EditingMessageId, { $set: { text: req.body.text, Edited: true, } }, { new: true })
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.put("/savename/:chatId", async (req, res) => {
    try {

        const data = await storechat.findOneAndUpdate({ chatId: req.params.chatId }, { $set: { Othername: req.body.nameInputt } }, { new: true })
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "logout successfully" });
    });
});


// Socket.IO connection

const onlineUsers = new Map(); // userId -> socket.id

io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    // when user joins (send their ID)
    socket.on("user-online", (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("online-users", Array.from(onlineUsers.keys())); // broadcast current online users
        console.log("User online:", userId);
    });

    socket.on("joinChat", ({ chatId, userId }) => {
        socket.join(chatId);
        console.log(`User ${userId} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, senderId, text }) => {
        try {
            const msg = new message({ chatId, senderId, text, readBy: [senderId], });
            await msg.save();
            io.to(chatId).emit("receiveMessage", msg);
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on("Deletedmessage", async ({ chatId, msgid }) => {
        try {
            const deletedMsg = await message.findById(msgid);
            io.to(chatId).emit("messageDeleted", deletedMsg._id);
        } catch (err) {
            console.error("Error emitting deleted message:", err);
        }
    });

    socket.on("Editedmessage", async ({ chatId, id }) => {
        try {
            const Editedmsg = await message.findById(id);
            io.to(chatId).emit("MessageEdited", Editedmsg);
        } catch (err) {
            console.error("Error emitting edited message:", err);
        }
    });



    socket.on("markAsRead", async ({ chatId, userId }) => {
        try {
            await message.updateMany(
                {
                    chatId,
                    senderId: { $ne: userId },
                    readBy: { $ne: userId },
                },
                { $push: { readBy: userId } }
            );

            const updatedMessages = await message.find({ chatId });
            io.to(chatId).emit("messagesUpdated", updatedMessages);
        } catch (err) {
            console.error("Error marking messages as read:", err);
        }
    });

    // handle disconnect
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        // remove user from onlineUsers map
        for (const [userId, id] of onlineUsers.entries()) {
            if (id === socket.id) {
                onlineUsers.delete(userId);
                console.log("User offline:", userId);
                break;
            }
        }
        // broadcast updated online users list
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });
});


// Start server
server.listen(5000, () => {
    console.log("Server is listening on port 5000");
});
