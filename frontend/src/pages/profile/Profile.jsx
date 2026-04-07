import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Profile.css";

export function Profile() {
  const { userData } = useSelector((state) => state.path);
  const user = JSON.parse(localStorage.getItem("neonverseUser")) || userData;

  const [username, setUsername] = useState(user.username || "");
  const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || "");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = () => {
    const updatedUser = { ...user, username, avatar_url: avatarUrl };
    localStorage.setItem("neonverseUser", JSON.stringify(updatedUser));
    alert("Profile updated!");
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Your Profile</h1>
      
      <div className="profile-avatar-section">
        <img src={avatarUrl} alt="Avatar" className="profile-avatar" />
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      <div className="profile-info">
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="profile-input"
        />
      </div>

      <button onClick={handleSave} className="profile-save-btn">
        Save
      </button>
    </div>
  );
}