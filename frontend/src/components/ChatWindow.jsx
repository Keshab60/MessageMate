import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";
import { AiOutlineSend } from "react-icons/ai";
import { useSelector } from "react-redux";

export default function ChatWindow({ chatId, socketRef, onlineUsers }) {
  const UserID = useSelector((state) => state.user.id);
  const [messages, setMessages] = useState([]);
  const [editndelete, setEditnDelete] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [EditingMessageId, setEditingMessageId] = useState(null);
  const [Selectedchat, SetSelectedchat] = useState("");
  const [text, setText] = useState("");
  const [isEdit, setisEdit] = useState(false);
  // const [onlineUsers, setOnlineUsers] = useState([]);

  const [nameInputt, setNameInputt] = useState("Enter Name");
  // const socketRef = useRef(null);
  const messageEndRef = useRef(null);

  //useeffect for auto focus on messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark all messages as read when chat opens
  useEffect(() => {

    if (chatId && socketRef?.current && UserID) {
      socketRef.current.emit("markAsRead", { chatId, userId: UserID });
    }

    // socketRef.current.on("messagesUpdated", (updatedMessages) => {
    //   setMessages(updatedMessages);
    // });

  }, [chatId, UserID, socketRef]);

  useEffect(() => {


    // announce this user is online

    // socketRef.current.emit("user-online", UserID);

    const fetchMessages = async () => {
      try {
        const res = await fetch(`https://messagemate-backend-0qh0.onrender.com/messages/${chatId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
        const res2 = await fetch(`https://messagemate-backend-0qh0.onrender.com/selectedchat/${chatId}`);
        if (res2.ok) {
          const data2 = await res2.json();
          SetSelectedchat(data2);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    fetchMessages();

    socketRef.current.emit("joinChat", { chatId, UserID });

    const handler = (msg) => setMessages((prev) => [...prev, msg]);
    socketRef.current.on("receiveMessage", handler);

    // listen for server’s broadcast of current online users

    // const onlineHandler = (users) => setOnlineUsers(users || []);
    // socketRef.current.on("online-users", onlineHandler);


    socketRef.current.on("messageDeleted", (deletedId) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === deletedId
            ? { ...m, text: "🚫 This message was deleted" }
            : m
        )
      );
    });

    socketRef.current.on("MessageEdited", (editedmessageinfo) => {
      setMessages((prev) =>
        prev.map((m) =>
          m._id === editedmessageinfo._id
            ? { ...m, text: editedmessageinfo.text, Edited: "true" }
            : m
        )
      );
    });


    return () => {
      socketRef.current.off("receiveMessage", handler);
      // socketRef.current.off("online-users", onlineHandler);
      // socketRef.current.disconnect();
    };
  }, [chatId, UserID]);


  const handleNameChanges = async () => {
    const resultt = await fetch(
      `https://messagemate-backend-0qh0.onrender.com/savename/${chatId}`,
      {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameInputt }),
      }
    );
    if (resultt.ok) {
      const data = await resultt.json()
      console.log(data.Othername)
      SetSelectedchat((prev) =>
        prev.map((chat) =>
          chat.chatId === chatId
            ? { ...chat, Othername: nameInputt } // update only this chat
            : chat
        )
      );
      setisEdit(false);
    }
  }

  const sendMessage = async () => {
    if (!text.trim()) return;

    if (EditingMessageId) {
      try {
        const resultt = await fetch(
          `https://messagemate-backend-0qh0.onrender.com/messages/${EditingMessageId}`,
          {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          }
        );
        if (resultt.ok) {
          const info = await resultt.json();
          await socketRef.current.emit("Editedmessage", { chatId, id: info._id });

          // const res = await fetch(`https://messagemate-backend-0qh0.onrender.com/messages/${chatId}`);
          // if (res.ok) {
          //   const data = await res.json();
          //   setMessages(data);
          // }
        }
      } catch (e) {
        console.error("Edit failed:", e);
      } finally {
        // IMPORTANT: exit edit mode so next send creates a new message
        setText("");
        setEditingMessageId(null);
        setisEdit(false);
      }
    } else {
      socketRef.current.emit("sendMessage", { chatId, senderId: UserID, text });
      setText("");
    }
  };


  const HandleDelete = async (msgid) => {
    const respond = await fetch(`https://messagemate-backend-0qh0.onrender.com/message/${msgid}`, {
      method: "put",
    });
    if (respond.ok) {
      socketRef.current.emit("Deletedmessage", { chatId, msgid });
      const message = await respond.json();
      alert(message.message);
      setEditnDelete(false);
      // const res = await fetch(`https://messagemate-backend-0qh0.onrender.com/messages/${chatId}`);
      // if (res.ok) {
      //   const data = await res.json();
      //   setMessages(data);
      // }
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  // Helper function to format message date
  const formatDateLabel = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    const isYesterday =
      messageDate.getDate() === yesterday.getDate() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getFullYear() === yesterday.getFullYear();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    return messageDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  console.log(onlineUsers)
  return (
    <div>
      {Selectedchat &&
        Selectedchat.map((el) => (
          <div
            key={el.chatId}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              backgroundColor: "#f0f2f5",
              padding: "9px 0px 9px 20px",
            }}
          >
            <div
              style={{
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
                marginRight: "10px",
              }}
            >
              {el.senderId === UserID
                ? el.Name.trim().slice(0, 2).toUpperCase()
                : el.Othername.trim().slice(0, 2).toUpperCase()}
            </div>


            {isEdit ? (
              <input
                type="text"
                value={nameInputt}
                onChange={(e) => setNameInputt(e.target.value)}
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  textAlign: "center",
                  border: "none",
                  borderBottom: "2px solid #fff",
                  background: "transparent",
                  color: "#1f1f1f",
                  outline: "none",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: "150px",
                }}
              >
                <p
                  style={{
                    color: "#495057",
                    fontWeight: "600",
                    margin: 0,
                  }}
                >
                  {el.senderId === UserID ? el.Name : el.Othername}
                </p>
                <p
                  style={{
                    color: "#6c757d",
                    fontSize: "14px",
                    margin: 0,
                  }}
                >
                  {
                    onlineUsers.includes(
                      String(
                        el.senderId === UserID ? el.receiverId : el.senderId
                      )
                    )
                      ? "Online"
                      : "Offline"
                  }
                </p>
              </div>
            )}
            {!isEdit ? (
              <button style={{
                flex: 1,
                padding: "12px 20px",
                border: "none",
                borderRadius: "10px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                // gap: "8px",
                // background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                //  color: "white",
              }} onClick={() => setisEdit(true)}>
                <i className="fas fa-edit"></i> Save Name
              </button>
            ) : (
              <>
                <button style={{
                  padding: "12px 20px",
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }} onClick={handleNameChanges} >
                  <i className="fas fa-save"></i> Save Changes
                </button>
                <button style={{
                  border: "none",
                  borderRadius: "10px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }} onClick={() => {
                  setisEdit(false);
                  setEditingMessageId(null);
                  setText("");
                }} >
                  <i className="fas fa-times"></i> Cancel
                </button>
              </>
            )}
          </div>
        ))
      }

      {/* Message area */}
      <div
        style={{
          height: 410,
          overflowY: "auto",
          borderBottom: "1px solid gray",
          padding: 5,
        }}
      >
        {messages.map((m, i) => {
          const currentDateLabel = formatDateLabel(m.createdAt);
          const prevDateLabel =
            i > 0 ? formatDateLabel(messages[i - 1].createdAt) : null;
          const showDateLabel = currentDateLabel !== prevDateLabel;

          return (
            <div
              key={i}
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems:
                  m.senderId === UserID ? "flex-start" : "flex-end",
              }}
            >
              {showDateLabel && (
                <div
                  style={{
                    position: "relative",
                    textAlign: "center",
                    width: "15%",
                    color: "#555",
                    fontSize: "12px",
                    margin: "10px 0",
                    backgroundColor: "#e4e6eb",
                    padding: "3px 10px",
                    borderRadius: "10px",
                    display: "inline-block",
                    alignSelf: "center",
                  }}
                >
                  {currentDateLabel}
                </div>
              )}
              <div style={{ position: "relative", width: "100%" }}>

                {editndelete === i && m.senderId === UserID && m.text != "🚫 This message was deleted" && (
                  <div
                    style={{
                      position: "absolute",
                      right: m.senderId === UserID ? "75%" : "10%",
                      top: "10px",
                      background: "white",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                      borderRadius: "6px",
                      padding: "5px",
                      zIndex: "10",
                    }}
                  >
                    <p
                      onClick={() => {
                        setEditingMessageId(m._id);
                        setText(m.text);
                        setEditnDelete(null);
                      }}
                    >
                      Edit
                    </p>
                    <p onClick={() => HandleDelete(m._id)}>Delete</p>
                  </div>
                )}
              </div>

              <div
                onClick={() => setEditnDelete(editndelete === i ? null : i)}
                style={{
                  backgroundColor:
                    m.senderId === UserID ? "#fff" : "rgb(169 244 244)",
                  width: "auto",
                  maxWidth: "55%",
                  margin: "7px 10px",
                  padding: "7px",
                  borderRadius:
                    m.senderId === UserID
                      ? "0px 6px 6px 6px"
                      : "6px 0px 6px 6px",
                  wordBreak: "break-word",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    color:
                      m.text === "🚫 This message was deleted"
                        ? "rgb(144 144 144)"
                        : "black",
                  }}
                >
                  {m.text}
                </p>
                <small style={{ fontSize: "10px" }}>
                  {m.Edited === "true"
                    ? "Edited " +
                    new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : new Date(m.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </small>
              </div>

            </div>
          )
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input area */}
      <div style={{ marginTop: 10, position: "relative" }}>
        <button
          onClick={() => setShowPicker(!showPicker)}
          style={{
            position: "absolute",
            left: "5.5%",
            top: "10px",
            fontSize: "20px",
            cursor: "pointer",
            border: "none",
            background: "none",
          }}
        >
          😊
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          style={{
            width: "70%",
            border: "none",
            borderRadius: "20px",
            padding: "12px 50px",
            fontSize: "15px",
            outline: "none",
            marginLeft: "20px",
          }}
          required
        />

        <button
          onClick={sendMessage}
          style={{
            background: "linear-gradient(135deg, #6e8efb, #a777e3)",
            borderRadius: "50px",
            width: "40px",
            height: "40px",
            border: "none",
            marginLeft: "12px",
            color: "white",
          }}
        >
          <AiOutlineSend color="white" size={20} />
        </button>
      </div>

      {
        showPicker && (
          <div
            style={{
              position: "absolute",
              bottom: "50px",
              left: "18%",
              zIndex: 10,
            }}
          >
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )
      }
    </div >
  );
}
