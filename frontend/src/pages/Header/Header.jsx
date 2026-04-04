import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePath } from "../../redux/slices/pathSlice";


export function Header(username) {
   const dispatch = useDispatch()
  const { path } = useSelector((state) => state.path);
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
  return (
    <div>
      <div onClick={changeApi} className="api">
        {localStorage.getItem("api") || path}
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