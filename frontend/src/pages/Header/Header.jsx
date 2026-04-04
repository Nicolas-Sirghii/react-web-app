import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePath } from "../../redux/slices/pathSlice";


export function Header(username) {
   const [message, setMessage] = useState("Veryfy");
   const dispatch = useDispatch()
   const { path } = useSelector((state) => state.path);
  const host = localStorage.getItem("api") || path;
  const [menuOpen, setMenuOpen] = useState(false);
  const re = useRef(null);
  useEffect(() => {
    re.current.innerText = localStorage.getItem("username") || "Login";
  }, [username])

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username")
    localStorage.removeItem("user_id")
    window.location.href = "/login";
  };
   function changeApi() {
    dispatch(changePath());
    localStorage.setItem("api", path)
  }


function sendVerificationById() {
  const userId = localStorage.getItem("user_id"); // get user_id from localStorage
  if (!userId) {
    setMessage("User not logged in.");
    return;
  }

  fetch(`${host}/send-verification-email-by-id`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      setMessage(`We sent a verification link to your email. Check your inbox.`);
    })
    .catch(() => {
      setMessage("Failed to send verification email.");
    });
}
  return (
    <div>
      <div onClick={changeApi} className="api">
        {localStorage.getItem("api") || path}
      </div>
      <div className="veryfy" onClick={sendVerificationById}>
        {message}
      </div>
      <div className="user-menu">
        <div
          className="user-circle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            src="https://i.pravatar.cc/100"
            alt="avatar"
          />
          <span ref={re}></span>
        </div>

        {menuOpen && (
          <div className="dropdown">
            <Link to="/"><button>Home</button></Link>
            <Link to="/message"><button>Message</button></Link>
            <Link to="/userimages">userImages</Link>
            <button>Profile</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>


    </div>






  )
}