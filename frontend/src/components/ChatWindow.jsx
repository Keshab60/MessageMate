
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { AiOutlineSend } from "react-icons/ai";
import { useSelector } from "react-redux";


export default function ChatWindow({ chatId }) {
  const UserID = useSelector((state) => state.user.id);
  console.log(UserID)
  const [messages, setMessages] = useState([]);
  const [editndelete, setEditnDelete] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [EditingMessageId, setEditingMessageId] = useState(null);
  const [Selectedchat, SetSelectedchat] = useState("")
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    // Load messages
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/messages/${chatId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
        const res2 = await fetch(`http://localhost:5000/selectedchat/${chatId}`);
        if (res2.ok) {
          const data2 = await res2.json();
          SetSelectedchat(data2);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    // Join chat room
    socketRef.current.emit("joinChat", { chatId, UserID });

    // Listen for incoming messages
    const handler = (msg) => setMessages((prev) => [...prev, msg]);
    socketRef.current.on("receiveMessage", handler);

    //This is for message deletion
    socketRef.current.on("messageDeleted", (deletedId) => {
      setMessages((prev) => prev.map(m =>
        m._id === deletedId ? { ...m, text: "🚫 This message was deleted" } : m
      ));
    });

    //This is for message edit
    socketRef.current.on("MessageEdited", (editedmessageinfo) => {
      setMessages((prev) => prev.map(m =>
        m._id === editedmessageinfo._id ? { ...m, text: editedmessageinfo.text } : m
      ));
    });

    // Cleanup on unmount
    return () => {
      socketRef.current.off("receiveMessage", handler);
      socketRef.current.disconnect();
    };
  }, [chatId, UserID]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    // create a socket connection here or pass it from parent
    // For now, you need to keep the socket reference from useEffect
    // OR lift socket to parent

    if (EditingMessageId) {
      const resultt = await fetch(`http://localhost:5000/messages/${EditingMessageId}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      })
      if (resultt.ok) {
        const info = await resultt.json();
        socketRef.current.emit("Editedmessage", { chatId, id: info._id });
        const res = await fetch(`http://localhost:5000/messages/${chatId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
        setText("");
      }

    } else {
      socketRef.current.emit("sendMessage", { chatId, senderId: UserID, text });
      setText("");
    }
  };
  const HandleDelete = async (msgid) => {
    const respond = await fetch(`http://localhost:5000/message/${msgid}`, {
      method: "put",
    })
    if (respond.ok) {
      socketRef.current.emit("Deletedmessage", { chatId, msgid });
      const message = await respond.json();
      alert(message.message)
      setEditnDelete(false)
      const res = await fetch(`http://localhost:5000/messages/${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    }
  }

  const onEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  return (
    <div>

      {Selectedchat && Selectedchat.map((el, index) => (
        <div
          key={el.chatId}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            cursor: "pointer",
            backgroundColor: "#f0f2f5",
            padding: "9px 0px 9px 20px"
          }}
        >
          {/* Avatar */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            fontWeight: "bold",
            fontSize: "15px",
            color: "white",
            background: "linear-gradient(135deg, #6e8efb, #a777e3)",
            marginRight: "10px"
          }}>
            {el.senderId === UserID ? el.Name.trim().slice(0, 2).toUpperCase() : "Un"}
          </div>

          {/* Chat Info */}
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "150px",
          }}>
            <p style={{
              color: "#495057",
              fontWeight: "600",
              margin: 0
            }}>{el.senderId === UserID ? el.Name : "Unknown"}</p>
            <p style={{
              color: "#6c757d",
              fontSize: "14px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "150px",
              margin: 0
            }}>Online</p>
          </div>
        </div>
      ))}

      <div style={{ height: 410, overflowY: "auto", borderBottom: "1px solid gray", padding: 5 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: m.senderId === UserID ? "flex-start" : "flex-end",
          }}>

            {editndelete === i && m.senderId === UserID && (<div style={{
              position: "absolute",
              // top: "-40px",
              right: m.senderId === UserID ? "75%" : "10%",
              // left:"0",
              background: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              borderRadius: "6px",
              padding: "5px",
              zIndex: "10",
            }}>
              <p onClick={() => {
                setEditingMessageId(m._id); // store message id
                setText(m.text); // show old text in input
                setEditnDelete(null)
              }}>Edit</p>
              <p onClick={() => HandleDelete(m._id)}>Delete</p>
            </div>)}
            <div key={i} style={{
              backgroundColor: m.senderId === UserID ? "#fff" : "rgb(169 244 244)",
              width: "auto",
              maxWidth: "55%",
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "7px",
              padding: "7px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              borderRadius: m.senderId === UserID ? "0px 6px 6px 6px" : "6px 0px 6px 6px",
              wordBreak: "break-word"
            }} onClick={() => setEditnDelete(editndelete === i ? null : i)}>
              <p style={{ margin: 0, color: m.text === "🚫 This message was deleted" ? "rgb(144 144 144)" : "black" }} >{m.text}</p>
              <small style={{ fontSize: "10px" }}>
                {m.Edited === "true" ? "Edited " + new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </small>

            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, position: "relative" }}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{ position: "absolute", left: "5.5%", top: "10px", marginRight: "8px", fontSize: "20px", cursor: "pointer", border: "none", background: "none" }}
        >
          😊
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          style={{
            width: "70%", flex: " 1",
            border: "none",
            borderRadius: "20px",
            paddingTop: " 12px",
            paddingBottom: " 12px",
            paddingLeft: "50px",
            fontSize: "15px",
            outline: "none",
            marginLeft: "20px"
          }} required
        />
        <button onClick={sendMessage} style={{
          background: "linear-gradient(135deg, #6e8efb, #a777e3)",
          borderRadius: "50px",
          width: "40px",
          height: "40px",
          border: "none",
          marginLeft: "12px",
          color: "white",
        }}><AiOutlineSend color="white" size={20} /></button>
      </div>
      {
        showPicker && (
          <div style={{ position: "absolute", bottom: "50px", left: "18%", zIndex: 10 }}>
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )
      }
    </div >
  );
}
