import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { changeUserData } from "../../../redux/slices/pathSlice";
import "./HeaderSettings.css";

export function UserSettings() {
    const { userData } = useSelector((state) => state.path)
    const user = JSON.parse(localStorage.getItem("neonverseUser")) || userData
    const dispatch = useDispatch();

    const [formData, setFormData] = useState(user);

    //     {
    //   
    //     "username": "Me",
    //     "email": "nicolas.mailbox100@gmail.com",
    //     "is_verified": 1,
    //     "avatar_url": "https://sirghiinicolai.s3.amazonaws.com/avatars/40905343-51c1-458a-8d88-d16ec732b4fc.png",
    //     "age": null,
    //     "phone": null,
    //     "gender": null,
    //     "bio": null
    // }

    const [avatarFileName, setAvatarFileName] = useState("");
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        
        
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, avatar_url: URL.createObjectURL(file) }));
            setAvatarFileName(file.name);
        }
    };

    const handleVerifyEmail = () => {
        alert(`Verification email sent to ${formData.email}`);
        setFormData((prev) => ({ ...prev, is_verified: true }));
    };

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(changeUserData(formData))
        // alert("User settings updated (mock)");
        // const token = localStorage.getItem("jwt") || 0
        //     const res = await fetch("http://localhost:8000/upload-avatar", {
        //         method: "POST",
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //         body: formData,
        //     });

        //     const data = await res.json();
        //     console.log(data);



    };

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="cyber-settings-page">
            <h1>User Settings</h1>
            <form className="settings-form" onSubmit={handleSubmit}>
                {/* Avatar */}
                <div className="form-group avatar-group">




                    <label>Avatar</label>
                    <div className="avatar-preview" onClick={handleAvatarClick}>
                        {formData.avatar_url ? (
                            <img src={formData.avatar_url} alt="avatar" />
                        ) : (

                            localStorage.getItem("neonverseUser") ? (<img src={formData.avatar_url} />) : (<div className="avatar-placeholder">Click to add</div>)

                        )}
                    </div>



                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleAvatarChange}
                        style={{ display: "none" }}
                    />
                    {avatarFileName && <span className="file-name">{avatarFileName}</span>}
                </div>

                {/* Username */}
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}

                    />
                </div>

                {/* Email & Verification */}
                <div className="form-group email-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}

                    />
                    <div
                        className={`email-status ${formData.is_verified ? "verified" : "not-verified"
                            }`}
                    >
                        {formData.is_verified ? "Verified ✅" : "Not Verified ❌"}
                    </div>
                    {!formData.is_verified && (
                        <button
                            className="verify-btn"
                            onClick={handleVerifyEmail}
                        >
                            Verify Email
                        </button>
                    )}
                </div>

                {/* Additional info */}
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone ? formData.phone : ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age ? formData.age : ""}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label>Gender</label>
                    <select name="gender" value={formData.gender ? formData.gender : ""} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio ? formData.bio : ""}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Tell something about yourself..."
                    />
                </div>

                <button type="submit" className="save-btn">
                    Save Changes
                </button>
            </form>
        </div>
    );
}