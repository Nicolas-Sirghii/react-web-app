import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch} from "react-redux";
import { setUserData } from "../../redux/slices/userSlice";
import "./Profile.css";

export function Profile() {
  
  const fileInputRef = useRef(null);
  const dispatch = useDispatch()

  const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;
 

  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [avatarFile, setAvatarFile] = useState(null);

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

  // 🔄 Sync Redux → local
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
  }, [username, email, age, phone, gender, bio, avatar_url, is_verified]);

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
      setAvatarFile(file);

      const preview = URL.createObjectURL(file);

      setFormData({
        ...formData,
        avatarPreview: preview
      });
    }
  };

  // 🚀 SAVE PROFILE
  const handleSaveProfile = async () => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      setMessage("Not authenticated");
      setPopup(true);
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();

      form.append("username", formData.username);
      form.append("email", formData.email);
      form.append("age", formData.age);
      form.append("phone", formData.phone);
      form.append("gender", formData.gender);
      form.append("bio", formData.bio);

      if (avatarFile) {
        form.append("avatar", avatarFile);
      }
     

      const res = await fetch(`${host}/update-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      const data = await res.json();
       dispatch(setUserData(data.user_data))

      if (!res.ok) throw new Error(data.detail || "Error updating profile");

      setMessage("Profile updated successfully");
      setPopup(true);

    } catch (err) {
      setMessage(err.message);
      setPopup(true);
    } finally {
      setLoading(false);

      setTimeout(() => {
        setPopup(false);
      }, 4000);
    }
  };

 
  const handleSendEmail = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      setMessage("No login token found.");
      return;
    }

    try {
      const res = await fetch(`${host}/send-verification-email`, {
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
      setTimeout(() => {
        setPopup(false)
      }, 4000);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="profile-container">

      {/* LOADING */}
      {loading && (
        <div className="skeleton-overlay">
          <div className="skeleton-card"></div>
        </div>
      )}

      {/* AVATAR */}
      <div className="avatar-section">
        <img
          src={
            formData.avatarPreview ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH-UUug53VoMV0rggFl2tsYJ5oywZ43hjn-Q&s"
          }
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

          <span onClick={formData.is_verified ? undefined : handleSendEmail}
            className={formData.is_verified ? "verified" : "not-verified"}
          >
            {formData.is_verified ? "VERIFIED" : "NOT VERIFIED"}
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

      {/* SAVE BUTTON */}
      <button onClick={handleSaveProfile}>
        {loading ? "Saving..." : "SAVE PROFILE"}
      </button>

      {/* POPUP */}
      {popup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>{message}</h2>
          </div>
        </div>
      )}
    </div>
  );
}