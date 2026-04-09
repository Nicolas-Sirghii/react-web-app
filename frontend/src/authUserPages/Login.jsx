import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { setUserData, cahngeAutorized } from "../redux/slices/pathSlice";
import { useDispatch } from "react-redux";
import { check_autorization, setTimeLeft } from "../redux/slices/loginSlice";

export function Login() {
  const dispatch = useDispatch();
  const { path } = useSelector((state) => state.path);
  // const { username , email, is_verified, avatar_url, age, phone, gender, bio } = useSelector((state) => state.user);
  const host = localStorage.getItem("api") || path;
  const navigate = useNavigate();
 
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 loading state
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await fetch(`${host}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!data.token || data.token === "Invalid Credentials") {
        throw new Error("Invalid email or password");
      }
       dispatch(setUserData(data.user))

       // backend gives: expire_minutes
      const expiresAt = Date.now() + data.expire_minutes * 60 * 1000;
      localStorage.setItem("expires_at", expiresAt);
      dispatch(setTimeLeft())
       dispatch(cahngeAutorized(true))
       dispatch(check_autorization(true))
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("neonverseUser", JSON.stringify(data.user))
      navigate("/");
    } catch (err) {
      setError(err.message);
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>LOGIN</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          disabled={loading}
        />

        <input
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            disabled={loading}
          />
          Show Password
        </label>

        <button
          type="submit"
          disabled={loading}
          className={loading ? "skeleton skeleton-button" : ""}
        >
          {loading ? "" : "Login"}
        </button>

        <p className="link">
          <a href="/forgot-password">Forgot Password?</a>
        </p>

        <p className="link">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h3>Login Error</h3>
            <p>{error}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}