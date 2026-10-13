import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../Redux/UserSlice.js";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import { FiMail, FiHash, FiEdit2, FiCheck, FiX, FiArrowLeft, FiCopy } from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.name || "");
  const [copiedId, setCopiedId] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const avatarList = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200&q=80",
    "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=200&h=200&q=80",
    "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
  ];

  const handleNextAvatar = () => {
    const currentIndex = avatarList.indexOf(profileImage);
    const nextIndex = (currentIndex + 1) % avatarList.length;
    setProfileImage(avatarList[nextIndex]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSaveChanges = async () => {
    if (!nameInput.trim()) return;
    try {
      const res = await fetch(`${API_URL}/update-user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput }),
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(setUser({ ...user, name: nameInput }));
        setStatusMsg("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setStatusMsg(""), 3000);
      } else {
        setStatusMsg(data.message || "Failed to update profile");
      }
    } catch {
      setStatusMsg("Error updating profile. Please try again.");
    }
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        className="glass-panel animate-scale-in"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "28px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Banner with gradient */}
        <div
          style={{
            height: "130px",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            padding: "16px",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              background: "rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(10px)",
              color: "white",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            <FiArrowLeft /> Back to Chat
          </Link>
        </div>

        {/* Profile Card Body */}
        <div style={{ padding: "0 32px 36px", position: "relative" }}>
          {/* Avatar Area */}
          <div
            style={{
              marginTop: "-60px",
              display: "flex",
              justifyContent: "center",
              marginBottom: "16px",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={profileImage}
                alt="Profile Avatar"
                style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid rgba(17, 24, 39, 0.95)",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
                }}
              />
              <button
                type="button"
                onClick={handleNextAvatar}
                title="Change Avatar"
                style={{
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "2px solid #0f172a",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "14px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                📸
              </button>
            </div>
          </div>

          {/* Name Display or Edit */}
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            {isEditing ? (
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  autoFocus
                  style={{
                    padding: "8px 16px",
                    borderRadius: "10px",
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid #6366f1",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: 700,
                    textAlign: "center",
                    outline: "none",
                  }}
                />
                <button
                  onClick={handleSaveChanges}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "#10b981",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FiCheck />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <FiX />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#f8fafc" }}>
                  {user.name || "Anonymous User"}
                </h2>
                <button
                  onClick={() => {
                    setNameInput(user.name || "");
                    setIsEditing(true);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#818cf8",
                    cursor: "pointer",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Edit Name"
                >
                  <FiEdit2 />
                </button>
              </div>
            )}
            <p style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>
              MessageMate Member
            </p>
          </div>

          {statusMsg && (
            <div
              style={{
                marginBottom: "16px",
                padding: "8px 14px",
                borderRadius: "10px",
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                color: "#a5b4fc",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              {statusMsg}
            </div>
          )}

          {/* User Details Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
            {/* Email item */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ color: "#818cf8", fontSize: "18px" }}>
                  <FiMail />
                </div>
                <div>
                  <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                    Email
                  </div>
                  <div style={{ fontSize: "14px", color: "#f1f5f9", fontWeight: 500 }}>
                    {user.email || "No email"}
                  </div>
                </div>
              </div>
            </div>

            {/* User ID item with copy button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderRadius: "14px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                <div style={{ color: "#818cf8", fontSize: "18px" }}>
                  <FiHash />
                </div>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 }}>
                    My User ID
                  </div>
                  <div style={{ fontSize: "14px", color: "#f1f5f9", fontWeight: 600, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.id || "Not logged in"}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(user.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  background: copiedId ? "rgba(16, 185, 129, 0.2)" : "rgba(99, 102, 241, 0.15)",
                  border: `1px solid ${copiedId ? "#10b981" : "rgba(99, 102, 241, 0.3)"}`,
                  color: copiedId ? "#10b981" : "#a5b4fc",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                {copiedId ? (
                  <>
                    <FiCheck /> Copied
                  </>
                ) : (
                  <>
                    <FiCopy /> Copy
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              to="/"
              className="btn-gradient"
              style={{ flex: 1, padding: "12px 20px", fontSize: "14px" }}
            >
              Go to Chats
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
