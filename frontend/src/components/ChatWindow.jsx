import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useSelector } from "react-redux";
import { API_URL } from "../config";
import {
  FiSend,
  FiSmile,
  FiEdit2,
  FiCheck,
  FiX,
  FiMoreVertical,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";

export default function ChatWindow({ chatId, socketRef, onlineUsers, onBack }) {
  const UserID = useSelector((state) => state.user.id);
  const [messages, setMessages] = useState([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [selectedChatData, setSelectedChatData] = useState([]);
  const [text, setText] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const messageEndRef = useRef(null);
  const pickerRef = useRef(null);

  // Auto scroll to latest message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    if (chatId && socketRef?.current && UserID) {
      socketRef.current.emit("markAsRead", { chatId, userId: UserID });
    }
  }, [chatId, UserID, socketRef]);

  // Close emoji picker when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  // Load chat messages and partner info
  useEffect(() => {
    const currentSocket = socketRef.current;

    const fetchChatDetails = async () => {
      try {
        const res = await fetch(`${API_URL}/messages/${chatId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
        const res2 = await fetch(`${API_URL}/selectedchat/${chatId}`);
        if (res2.ok) {
          const data2 = await res2.json();
          setSelectedChatData(data2);
          if (data2.length > 0) {
            const partnerName = data2[0].senderId === UserID ? data2[0].Name : data2[0].Othername;
            setNameInput(partnerName || "");
          }
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchChatDetails();

    if (currentSocket) {
      currentSocket.emit("joinChat", { chatId, UserID });

      const handler = (msg) => setMessages((prev) => [...prev, msg]);
      currentSocket.on("receiveMessage", handler);

      const deleteHandler = (deletedId) => {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === deletedId
              ? { ...m, text: "🚫 This message was deleted" }
              : m
          )
        );
      };
      currentSocket.on("messageDeleted", deleteHandler);

      const editHandler = (editedmessageinfo) => {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === editedmessageinfo._id
              ? { ...m, text: editedmessageinfo.text, Edited: "true" }
              : m
          )
        );
      };
      currentSocket.on("MessageEdited", editHandler);

      return () => {
        currentSocket.off("receiveMessage", handler);
        currentSocket.off("messageDeleted", deleteHandler);
        currentSocket.off("MessageEdited", editHandler);
      };
    }
  }, [chatId, UserID, socketRef]);

  // Handle renaming chat partner
  const handleNameChanges = async () => {
    if (!nameInput.trim()) return;
    try {
      const result = await fetch(`${API_URL}/savename/${chatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameInputt: nameInput }),
      });
      if (result.ok) {
        setSelectedChatData((prev) =>
          prev.map((c) =>
            c.chatId === chatId ? { ...c, Othername: nameInput } : c
          )
        );
        setIsEditingName(false);
      }
    } catch (err) {
      console.error("Failed to save name:", err);
    }
  };

  // Send or Edit message
  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    if (editingMessageId) {
      try {
        const result = await fetch(`${API_URL}/messages/${editingMessageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (result.ok) {
          const info = await result.json();
          socketRef.current?.emit("Editedmessage", { chatId, id: info._id });
        }
      } catch (e) {
        console.error("Edit failed:", e);
      } finally {
        setText("");
        setEditingMessageId(null);
      }
    } else {
      socketRef.current?.emit("sendMessage", { chatId, senderId: UserID, text });
      setText("");
    }
  };

  // Delete message
  const handleDelete = async (msgid) => {
    try {
      const respond = await fetch(`${API_URL}/message/${msgid}`, {
        method: "PUT",
      });
      if (respond.ok) {
        socketRef.current?.emit("Deletedmessage", { chatId, msgid });
        setActiveMenuIndex(null);
      }
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const onEmojiClick = (emojiObject) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setText("");
  };

  // Helper date formatter
  const formatDateLabel = (dateString) => {
    if (!dateString) return "Today";
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

  const chatInfo = selectedChatData[0] || {};
  const partnerName = chatInfo.senderId === UserID ? chatInfo.Name : chatInfo.Othername;
  const partnerUserId = chatInfo.senderId === UserID ? chatInfo.receiverId : chatInfo.senderId;
  const isOnline = onlineUsers.includes(String(partnerUserId));
  const partnerInitials = partnerName ? partnerName.trim().slice(0, 2).toUpperCase() : "??";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: "rgba(11, 15, 25, 0.45)",
        position: "relative",
      }}
    >
      {/* Chat Window Top Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Avatar with live status pulse */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                fontSize: "15px",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.35)",
              }}
            >
              {partnerInitials}
            </div>
            <span
              style={{
                position: "absolute",
                bottom: "-2px",
                right: "-2px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: isOnline ? "#10b981" : "#64748b",
                border: "2px solid #0f172a",
                boxShadow: isOnline ? "0 0 10px #10b981" : "none",
              }}
            />
          </div>

          {/* Name & status */}
          <div>
            {isEditingName ? (
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  autoFocus
                  style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    background: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid #6366f1",
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 600,
                    outline: "none",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleNameChanges();
                    if (e.key === "Escape") setIsEditingName(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleNameChanges}
                  style={{
                    background: "#10b981",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    padding: "5px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FiCheck />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                    borderRadius: "6px",
                    color: "#94a3b8",
                    padding: "5px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f8fafc", margin: 0 }}>
                  {partnerName || "Chat"}
                </h3>
                <button
                  onClick={() => setIsEditingName(true)}
                  title="Rename Contact"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#818cf8",
                    cursor: "pointer",
                    fontSize: "13px",
                    padding: "2px 4px",
                    display: "flex",
                    alignItems: "center",
                    opacity: 0.8,
                  }}
                >
                  <FiEdit2 />
                </button>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
              <span style={{ fontSize: "12px", color: isOnline ? "#34d399" : "#94a3b8", fontWeight: 500 }}>
                {isOnline ? "Active now" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Details */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {onBack && (
            <button
              onClick={onBack}
              className="btn-ghost"
              style={{ fontSize: "12px", padding: "6px 12px" }}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px 24px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              margin: "auto",
              textAlign: "center",
              color: "#64748b",
              maxWidth: "320px",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👋</div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#94a3b8", marginBottom: "4px" }}>
              Start the conversation
            </p>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              Send a greeting to {partnerName || "your contact"} to begin messaging.
            </p>
          </div>
        ) : (
          messages.map((m, i) => {
            const isMe = m.senderId === UserID;
            const isDeleted = m.text === "🚫 This message was deleted";
            const currentDateLabel = formatDateLabel(m.createdAt);
            const prevDateLabel = i > 0 ? formatDateLabel(messages[i - 1].createdAt) : null;
            const showDateLabel = currentDateLabel !== prevDateLabel;

            return (
              <React.Fragment key={m._id || i}>
                {/* Date separator chip */}
                {showDateLabel && (
                  <div
                    style={{
                      alignSelf: "center",
                      margin: "12px 0",
                      padding: "4px 14px",
                      borderRadius: "9999px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#94a3b8",
                      fontSize: "11px",
                      fontWeight: 600,
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {currentDateLabel}
                  </div>
                )}

                {/* Message bubble row */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isMe ? "flex-end" : "flex-start",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      flexDirection: isMe ? "row-reverse" : "row",
                      maxWidth: "75%",
                    }}
                  >
                    {/* Bubble */}
                    <div
                      style={{
                        padding: "10px 16px",
                        borderRadius: isMe ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                        background: isMe
                          ? isDeleted
                            ? "rgba(255, 255, 255, 0.05)"
                            : "linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)"
                          : "rgba(255, 255, 255, 0.07)",
                        border: isMe ? "none" : "1px solid rgba(255, 255, 255, 0.08)",
                        color: isDeleted ? "#94a3b8" : "#ffffff",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        wordBreak: "break-word",
                        fontStyle: isDeleted ? "italic" : "normal",
                        boxShadow: isMe && !isDeleted ? "0 4px 15px rgba(99, 102, 241, 0.3)" : "none",
                        position: "relative",
                      }}
                    >
                      <p style={{ margin: 0 }}>{m.text}</p>

                      {/* Timestamp and edit indicator */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: "4px",
                          marginTop: "4px",
                          fontSize: "10px",
                          color: isMe ? "rgba(255, 255, 255, 0.7)" : "#94a3b8",
                        }}
                      >
                        {m.Edited === "true" && <span>edited • </span>}
                        <span>
                          {m.createdAt
                            ? new Date(m.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                        {isMe && !isDeleted && (
                          <FiCheckCircle style={{ fontSize: "10px", opacity: 0.8 }} />
                        )}
                      </div>
                    </div>

                    {/* Action Menu Toggle (for sender's non-deleted messages) */}
                    {isMe && !isDeleted && (
                      <div style={{ position: "relative" }}>
                        <button
                          type="button"
                          onClick={() => setActiveMenuIndex(activeMenuIndex === i ? null : i)}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "#64748b",
                            cursor: "pointer",
                            fontSize: "14px",
                            padding: "4px",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            opacity: activeMenuIndex === i ? 1 : 0.6,
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                            e.currentTarget.style.color = "#a5b4fc";
                          }}
                          onMouseLeave={(e) => {
                            if (activeMenuIndex !== i) {
                              e.currentTarget.style.opacity = "0.6";
                              e.currentTarget.style.color = "#64748b";
                            }
                          }}
                        >
                          <FiMoreVertical />
                        </button>

                        {/* Menu Popover */}
                        {activeMenuIndex === i && (
                          <div
                            style={{
                              position: "absolute",
                              right: isMe ? "100%" : "auto",
                              left: !isMe ? "100%" : "auto",
                              top: "0",
                              background: "rgba(17, 24, 39, 0.96)",
                              backdropFilter: "blur(20px)",
                              border: "1px solid rgba(255, 255, 255, 0.12)",
                              borderRadius: "12px",
                              padding: "6px",
                              zIndex: 20,
                              minWidth: "100px",
                              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMessageId(m._id);
                                setText(m.text);
                                setActiveMenuIndex(null);
                              }}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                background: "none",
                                border: "none",
                                color: "#cbd5e1",
                                fontSize: "13px",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                            >
                              <FiEdit2 /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(m._id)}
                              style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "8px 10px",
                                borderRadius: "8px",
                                background: "none",
                                border: "none",
                                color: "#f87171",
                                fontSize: "13px",
                                cursor: "pointer",
                                textAlign: "left",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.12)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Editing Message Banner */}
      {editingMessageId && (
        <div
          style={{
            padding: "8px 20px",
            background: "rgba(99, 102, 241, 0.15)",
            borderTop: "1px solid rgba(99, 102, 241, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "13px",
            color: "#a5b4fc",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiEdit2 />
            <span>Editing message (press Esc or Cancel to dismiss)</span>
          </div>
          <button
            type="button"
            onClick={cancelEdit}
            style={{
              background: "none",
              border: "none",
              color: "#f87171",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div
        style={{
          padding: "16px 24px",
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
        }}
      >
        <form
          onSubmit={sendMessage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(11, 15, 25, 0.7)",
            padding: "6px 8px 6px 16px",
            borderRadius: "9999px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
          }}
        >
          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowPicker(!showPicker)}
            style={{
              background: "none",
              border: "none",
              color: showPicker ? "#818cf8" : "#94a3b8",
              cursor: "pointer",
              fontSize: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "4px",
              transition: "all 0.2s ease",
            }}
            title="Choose emoji"
          >
            <FiSmile />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={editingMessageId ? "Edit your message..." : "Type a message..."}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontSize: "14px",
              padding: "8px 4px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape" && editingMessageId) {
                cancelEdit();
              }
            }}
          />

          {/* Send / Update Button */}
          <button
            type="submit"
            disabled={!text.trim()}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: text.trim()
                ? "linear-gradient(135deg, #6366f1, #d946ef)"
                : "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "17px",
              cursor: text.trim() ? "pointer" : "default",
              transition: "all 0.2s ease",
              boxShadow: text.trim() ? "0 0 15px rgba(99, 102, 241, 0.45)" : "none",
            }}
          >
            {editingMessageId ? <FiCheck /> : <FiSend />}
          </button>
        </form>

        {/* Emoji Picker Popover */}
        {showPicker && (
          <div
            ref={pickerRef}
            style={{
              position: "absolute",
              bottom: "76px",
              left: "24px",
              zIndex: 100,
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6)",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <EmojiPicker
              theme="dark"
              onEmojiClick={onEmojiClick}
              previewConfig={{ showPreview: false }}
              height={380}
              width={320}
            />
          </div>
        )}
      </div>
    </div>
  );
}
