import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../Redux/UserSlice.js";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const [profileImage, setProfileImage] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(user.full_name || "");

  const images = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=200&h=200&q=80",
    "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=200&h=200&q=80",
  ];

  const handleEditPhoto = () => {
    const currentIndex = images.indexOf(profileImage);
    const nextImage =
      currentIndex === -1 || currentIndex === images.length - 1
        ? images[0]
        : images[currentIndex + 1];
    setProfileImage(nextImage);
  };

  const handleSaveChanges = async () => {
    try {
      const res = await fetch(`https://messagemate-backend-0qh0.onrender.com/update-user/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameInput }),
      });
      const data = await res.json();

      if (res.ok) {
        dispatch(setUser({ ...user, name: nameInput }));
        alert("Profile updated successfully!");
        setIsEditing(false);
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #6e8efb, #a777e3)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .profile-container { background: white; border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.2); width: 100%; max-width: 400px; overflow: hidden; animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .profile-header { background: linear-gradient(135deg, #6e8efb, #a777e3); padding: 40px 20px 30px; text-align: center; color: white; position: relative; }
        .profile-image-container { position: relative; display: inline-block; margin-bottom: 15px; }
        .profile-image { width: 120px; height: 120px; border-radius: 50%; border: 5px solid white; object-fit: cover; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .edit-photo-btn { position: absolute; bottom: 5px; right: 5px; width: 36px; height: 36px; border-radius: 50%; background: #2575fc; border: 2px solid white; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; }
        .edit-photo-btn:hover { background: #6a11cb; transform: scale(1.1); }
        .profile-name { font-size: 24px; font-weight: 600; margin-bottom: 5px; }
        .profile-content { padding: 30px; }
        .info-item { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f8f8f8; }
        .info-label { color: #666; font-weight: 500; width: 80px; display: flex; align-items: center; gap: 8px; }
        .info-value { color: #333; font-weight: 600; flex: 1; }
        .action-buttons { display: flex; gap: 12px; margin-top: 25px; }
        .btn { flex: 1; padding: 12px 20px; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-primary { background: linear-gradient(135deg, #6e8efb, #a777e3); color: white; }
        .btn-secondary { background: #f8f9fa; color: #666; border: 2px solid #e9ecef; }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
        @media (max-width: 480px) { .action-buttons { flex-direction: column; } }
      `}</style>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-image-container">
            <img src={profileImage} alt="Profile" className="profile-image" />
            <div className="edit-photo-btn" onClick={handleEditPhoto}>
              <i className="fas fa-camera"></i>
            </div>
          </div>

          {isEditing ? (
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                fontSize: 24,
                fontWeight: 600,
                textAlign: "center",
                border: "none",
                borderBottom: "2px solid #fff",
                background: "transparent",
                color: "#fff",
                outline: "none",
              }}
            />
          ) : (
            <h1 className="profile-name">{user.name || "Alex Johnson"}</h1>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">
                <i className="fas fa-envelope"></i> Email
              </span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">
                <i className="fas fa-user"></i> User ID
              </span>
              <span className="info-value">{user.id}</span>
            </div>
          </div>

          <div className="action-buttons">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            ) : (
              <>
                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  <i className="fas fa-save"></i> Save Changes
                </button>
                <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                  <i className="fas fa-times"></i> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
