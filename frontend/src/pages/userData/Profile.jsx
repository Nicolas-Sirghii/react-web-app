import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Profile.css";

export function Profile() {
  const fileInputRef = useRef(null);
  const [popup, setPopup] = useState(false);

  // 🔥 Redux user data
  const {
    username,
    email,
    is_verified,
    avatar_url,
    age,
    phone,
    gender,
    bio
  } = useSelector((state) => state.userSlice);

  // Local editable state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    age: "",
    phone: "",
    gender: "",
    bio: "",
    avatarPreview: "",
    is_verified: false
  });

  // 🔄 Sync Redux → local state
  useEffect(() => {
    setFormData({
      username: username || "",
      email: email || "",
      age: age || "",
      phone: phone || "",
      gender: gender || "",
      bio: bio || "",
      avatarPreview: avatar_url || "",
      is_verified: is_verified || false
    });
  }, [
    username,
    email,
    age,
    phone,
    gender,
    bio,
    avatar_url,
    is_verified
  ]);

  // ✏️ input handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 🖼 avatar click
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // 🖼 avatar change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData({
        ...formData,
        avatarPreview: URL.createObjectURL(file)
      });
    }
  };

  // 📧 verify email (UI simulation for now)
  // const verifyEmail = () => {
  //   setPopup(true);

  //   setTimeout(() => {
  //     setPopup(false);
  //     setFormData((prev) => ({
  //       ...prev,
  //       is_verified: true
  //     }));
  //   }, 1200);
  // };
  //..............................................................................
  const [message, setMessage] = useState("");
  const [expires, setExpires] = useState("")


  const handleSendEmail = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessage("No login token found.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/send-verification-email", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Something went wrong");

      
      setPopup(true)
      setMessage(data.message);
      setExpires(data.expires)
      setTimeout(() => {
        setPopup(false)
      }, 6000);
    } catch (err) {
      setMessage(err.message);
    }
  };
  //................................................................................

  return (
    <div className="profile-container">

      {/* AVATAR */}
      <div className="avatar-section">
        <img
          src={formData.avatarPreview || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH-UUug53VoMV0rggFl2tsYJ5oywZ43hjn-Q&s"}
          className="avatar"
          onClick={handleAvatarClick}
        />

        <input
          type="file"
          hidden
          ref={fileInputRef}
          onChange={handleAvatarChange}
        />

        <div className="avatar-hint">
          Click avatar to change image
        </div>
      </div>

      {/* USERNAME */}
      <div className="field">
        <label>USERNAME</label>
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      {/* EMAIL */}
      <div className="field">
        <label>EMAIL</label>

        <div className="email-row">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <span
            className={formData.is_verified ? "verified" : "not-verified"}
            onClick={!formData.is_verified ? handleSendEmail : undefined }
          >
            {formData.is_verified ? "VERIFIED" : "VERIFY"}
          </span>
        </div>
      </div>

      {/* AGE */}
      <div className="field">
        <label>AGE</label>
        <input
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>

      {/* PHONE */}
      <div className="field">
        <label>PHONE</label>
        <input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      {/* GENDER */}
      <div className="field">
        <label>GENDER</label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      {/* BIO */}
      <div className="field">
        <label>BIO</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
        />
      </div>

      {/* SAVE BUTTON (UI only for now) */}
      <button>SAVE PROFILE</button>

      {/* POPUP */}
      {popup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{message}</h2>
            <p>Expires in <span className="expiresMinutes">{expires}</span> minutes.</p>
          </div>
        </div>
      )}
    </div>
  );
}