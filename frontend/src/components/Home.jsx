import React, { useEffect, useState, useRef, useCallback } from 'react';
import io from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import ChatWindow from './ChatWindow';
import { useSelector } from "react-redux";
import { API_URL } from '../config';
import {
  FiSearch,
  FiPlus,
  FiX,
  FiMessageSquare,
  FiUser,
  FiHash,
  FiCheck,
  FiCopy,
  FiRadio,
  FiArrowLeft
} from "react-icons/fi";

const Home = () => {
  const UserID = useSelector((state) => state.user.id);
  const userName = useSelector((state) => state.user.name);
  const [chat, setChat] = useState([]);
  const [otherchat, setOtherchat] = useState("");
  const [name, setName] = useState("");
  const [formtoggle, setFormtoggle] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedMyId, setCopiedMyId] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [statusAlert, setStatusAlert] = useState("");
  const socketRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all chats for this user
  const fetchchat = useCallback(async () => {
    if (!UserID) return;
    try {
      const res = await fetch(`${API_URL}/chats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID }),
      });

      if (res.ok) {
        const data = await res.json();
        setChat(data);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  }, [UserID]);

  useEffect(() => {
    if (!UserID) {
      navigate("/login");
      return;
    }

    socketRef.current = io(API_URL);
    socketRef.current.emit("user-online", UserID);

    const onlineHandler = (users) => setOnlineUsers(users || []);
    socketRef.current.on("online-users", onlineHandler);

    fetchchat();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("online-users", onlineHandler);
        socketRef.current.disconnect();
      }
    };
  }, [UserID, fetchchat, navigate]);

  // Start a new chat
  const startnewchat = async (e) => {
    e.preventDefault();
    if (!otherchat.trim() || !name.trim()) return;
    setCreatingChat(true);

    try {
      const storechat = await fetch(`${API_URL}/storechats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UserID, otherchat: otherchat.trim(), Name: name.trim(), senderId: UserID }),
      });

      const message = await storechat.json();
      if (storechat.ok) {
        setStatusAlert("Conversation created successfully!");
        setOtherchat("");
        setName("");
        setFormtoggle(false);
        await fetchchat();
      } else {
        setStatusAlert(message.message || "Could not start chat");
      }
    } catch {
      setStatusAlert("Network error while creating conversation");
    } finally {
      setCreatingChat(false);
      setTimeout(() => setStatusAlert(""), 4000);
    }
  };

  const copyMyUserId = () => {
    if (!UserID) return;
    navigator.clipboard.writeText(UserID);
    setCopiedMyId(true);
    setTimeout(() => setCopiedMyId(false), 2000);
  };

  // Filter chats based on searchTerm (matching Name or Othername)
  const filteredChats = chat.filter((el) => {
    const contactName = el.senderId === UserID ? el.Name : el.Othername;
    return contactName?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "16px 20px 24px",
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
        height: "calc(100vh - 72px)",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .chat-sidebar {
            width: 100% !important;
            display: ${selectedChat ? "none !important" : "flex !important"};
          }
          .chat-main-pane {
            width: 100% !important;
            display: ${selectedChat ? "flex !important" : "none !important"};
          }
        }
      `}</style>

      {/* Status banner */}
      {statusAlert && (
        <div
          style={{
            marginBottom: "12px",
            padding: "10px 18px",
            borderRadius: "12px",
            background: "rgba(99, 102, 241, 0.2)",
            border: "1px solid rgba(99, 102, 241, 0.4)",
            color: "#c7d2fe",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>{statusAlert}</span>
          <button
            onClick={() => setStatusAlert("")}
            style={{ background: "none", border: "none", color: "#c7d2fe", cursor: "pointer" }}
          >
            <FiX />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div
        className="glass-panel"
        style={{
          flex: 1,
          display: "flex",
          borderRadius: "24px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5)",
          position: "relative",
          height: "100%",
        }}
      >
        {/* Left Sidebar: Chat List */}
        <div
          className="chat-sidebar"
          style={{
            width: "360px",
            minWidth: "320px",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(20px)",
            height: "100%",
          }}
        >
          {/* Sidebar Top: Title + Add Chat CTA */}
          <div
            style={{
              padding: "20px 20px 16px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
                Messages
              </h2>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  background: "rgba(99, 102, 241, 0.2)",
                  color: "#a5b4fc",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                }}
              >
                {chat.length}
              </span>
            </div>

            <button
              onClick={() => setFormtoggle(true)}
              className="btn-gradient"
              style={{
                padding: "8px 14px",
                fontSize: "13px",
                borderRadius: "12px",
                gap: "6px",
              }}
              title="Start a new chat"
            >
              <FiPlus style={{ fontSize: "16px" }} />
              <span>New Chat</span>
            </button>
          </div>

          {/* Search Bar */}
          <div style={{ padding: "14px 20px 10px" }}>
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#64748b",
                  fontSize: "16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FiSearch />
              </div>
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 40px",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  fontSize: "13px",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#6366f1";
                  e.target.style.boxShadow = "0 0 0 2px rgba(99, 102, 241, 0.25)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.08)";
                  e.target.style.boxShadow = "none";
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Online count badge */}
          <div
            style={{
              padding: "4px 20px 10px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "#10b981",
              fontWeight: 600,
            }}
          >
            <FiRadio style={{ animation: "pulseGlow 2s infinite" }} />
            <span>{onlineUsers.length} active users online</span>
          </div>

          {/* Chat List Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "6px 12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {filteredChats.length > 0 ? (
              filteredChats.map((el) => {
                const isSelected = selectedChat === el.chatId;
                const contactName = el.senderId === UserID ? el.Name : el.Othername;
                const partnerUserId = el.senderId === UserID ? el.receiverId : el.senderId;
                const isPartnerOnline = onlineUsers.includes(String(partnerUserId));
                const initials = contactName ? contactName.trim().slice(0, 2).toUpperCase() : "??";

                return (
                  <div
                    key={el.chatId}
                    onClick={() => setSelectedChat(el.chatId)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      background: isSelected
                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(168, 85, 247, 0.15))"
                        : "transparent",
                      border: isSelected
                        ? "1px solid rgba(99, 102, 241, 0.45)"
                        : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = "transparent";
                      }
                    }}
                  >
                    {/* Avatar with Online badge */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "12px",
                          background: isSelected
                            ? "linear-gradient(135deg, #6366f1, #d946ef)"
                            : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "14px",
                          fontWeight: 700,
                          boxShadow: isSelected
                            ? "0 0 15px rgba(99, 102, 241, 0.45)"
                            : "0 2px 8px rgba(0,0,0,0.2)",
                        }}
                      >
                        {initials}
                      </div>
                      {/* Online dot indicator */}
                      <span
                        style={{
                          position: "absolute",
                          bottom: "-2px",
                          right: "-2px",
                          width: "12px",
                          height: "12px",
                          borderRadius: "50%",
                          background: isPartnerOnline ? "#10b981" : "#64748b",
                          border: "2px solid #0f172a",
                          boxShadow: isPartnerOnline ? "0 0 8px #10b981" : "none",
                        }}
                      />
                    </div>

                    {/* Chat Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: "14px",
                            color: isSelected ? "#ffffff" : "#f1f5f9",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {contactName}
                        </span>
                        <span style={{ fontSize: "11px", color: isPartnerOnline ? "#34d399" : "#64748b", fontWeight: 500 }}>
                          {isPartnerOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "12px",
                          color: isSelected ? "#cbd5e1" : "#94a3b8",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          margin: 0,
                        }}
                      >
                        Click to view conversation
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", padding: "40px 16px", color: "#64748b" }}>
                <div style={{ fontSize: "36px", marginBottom: "12px", opacity: 0.6 }}>💬</div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#94a3b8", marginBottom: "6px" }}>
                  {searchTerm ? "No matching chats" : "No chats yet"}
                </p>
                <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "16px" }}>
                  {searchTerm ? "Try searching with a different term" : "Click '+ New Chat' to start messaging someone"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setFormtoggle(true)}
                    className="btn-ghost"
                    style={{ fontSize: "12px", padding: "6px 14px" }}
                  >
                    Start your first chat
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Chat Window or Empty State */}
        <div
          className="chat-main-pane"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            background: "rgba(11, 15, 25, 0.4)",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {selectedChat ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
              {/* Mobile Back Button Bar */}
              <div
                style={{
                  display: "none",
                  padding: "8px 16px",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                  background: "rgba(15, 23, 42, 0.8)",
                }}
                className="mobile-back-bar"
              >
                <style>{`
                  @media (max-width: 768px) {
                    .mobile-back-bar { display: flex !important; }
                  }
                `}</style>
                <button
                  onClick={() => setSelectedChat(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#818cf8",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  <FiArrowLeft /> Back to Messages
                </button>
              </div>

              <ChatWindow
                chatId={selectedChat}
                socketRef={socketRef}
                onlineUsers={onlineUsers}
                onBack={() => setSelectedChat(null)}
              />
            </div>
          ) : (
            /* Welcome / Empty Selection Screen */
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "30px",
              }}
            >
              <div
                className="animate-fade-in"
                style={{
                  maxWidth: "480px",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "18px",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))",
                    border: "1px solid rgba(99, 102, 241, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#a5b4fc",
                    fontSize: "36px",
                    boxShadow: "0 0 35px rgba(99, 102, 241, 0.25)",
                  }}
                >
                  <FiMessageSquare />
                </div>

                <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
                  Welcome back, {userName || "Friend"}!
                </h2>

                <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6" }}>
                  Select an existing conversation from the sidebar or start a new direct chat. You can share your unique User ID with friends so they can message you.
                </p>

                {/* Copy User ID Widget */}
                <div
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "16px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ textAlign: "left", overflow: "hidden" }}>
                    <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                      Your MessageMate ID
                    </div>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "14px",
                        color: "#a5b4fc",
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {UserID}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={copyMyUserId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "10px",
                      background: copiedMyId ? "rgba(16, 185, 129, 0.2)" : "rgba(99, 102, 241, 0.2)",
                      border: `1px solid ${copiedMyId ? "#10b981" : "rgba(99, 102, 241, 0.4)"}`,
                      color: copiedMyId ? "#10b981" : "#c7d2fe",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {copiedMyId ? (
                      <>
                        <FiCheck /> Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy /> Copy ID
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => setFormtoggle(true)}
                  className="btn-gradient"
                  style={{ padding: "12px 28px", fontSize: "14px", marginTop: "10px" }}
                >
                  <FiPlus /> Start New Chat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start New Chat Modal Dialog */}
      {formtoggle && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setFormtoggle(false)}
        >
          <div
            className="glass-panel animate-scale-in"
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "32px",
              borderRadius: "24px",
              position: "relative",
              background: "rgba(17, 24, 39, 0.96)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.6)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#ffffff" }}>
                Start a New Chat
              </h3>
              <button
                type="button"
                onClick={() => setFormtoggle(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#94a3b8",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <FiX />
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "20px" }}>
              Enter the User ID of the contact you want to chat with.
            </p>

            {/* Quick Share My ID Tip */}
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                background: "rgba(99, 102, 241, 0.1)",
                border: "1px solid rgba(99, 102, 241, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div style={{ fontSize: "12px", color: "#cbd5e1" }}>
                Your ID: <strong style={{ color: "#a5b4fc" }}>{UserID}</strong>
              </div>
              <button
                type="button"
                onClick={copyMyUserId}
                style={{
                  background: "none",
                  border: "none",
                  color: "#818cf8",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {copiedMyId ? <FiCheck /> : <FiCopy />} Copy
              </button>
            </div>

            <form onSubmit={startnewchat} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "8px" }}>
                  Friend's User ID
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FiHash />
                  </div>
                  <input
                    type="text"
                    value={otherchat}
                    onChange={(e) => setOtherchat(e.target.value)}
                    placeholder="e.g. 64f1a23b48..."
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 42px",
                      borderRadius: "12px",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#cbd5e1", marginBottom: "8px" }}>
                  Contact Name / Nickname
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#64748b",
                      fontSize: "16px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FiUser />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah"
                    required
                    style={{
                      width: "100%",
                      padding: "12px 16px 12px 42px",
                      borderRadius: "12px",
                      background: "rgba(15, 23, 42, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#ffffff",
                      fontSize: "14px",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  type="button"
                  onClick={() => setFormtoggle(false)}
                  className="btn-ghost"
                  style={{ flex: 1, borderRadius: "12px", padding: "12px" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingChat}
                  className="btn-gradient"
                  style={{ flex: 1, borderRadius: "12px", padding: "12px", opacity: creatingChat ? 0.7 : 1 }}
                >
                  {creatingChat ? "Starting..." : "Start Chat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
