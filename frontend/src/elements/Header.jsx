import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changePath } from "../redux/slices/pathSlice";
import { setTimeLeft } from "../redux/slices/loginSlice";

import "./Header.css";

export function Header() {
  const dispatch = useDispatch()
  const { timeLeft } = useSelector((state) => state.user_data);
  const { path, userData } = useSelector((state) => state.path);

  const user = JSON.parse(localStorage.getItem("neonverseUser")) || userData
  const host = localStorage.getItem("api") || path;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      // HH:MM:SS
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    // MM:SS
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(setTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  const username = user.username || "Neo";

  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  const toggleUserMenu = () => {
    if (avatarRef.current) {
      const rect = avatarRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 5, right: window.innerWidth - rect.right });
    }
    setUserMenuOpen(!userMenuOpen);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("api")
    localStorage.removeItem("neonverseUser")
    localStorage.removeItem("expires_at")

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);


  };
  const closeMenu = () => {
    setUserMenuOpen(false);
  }

  return (
    <header className="cyber-header">

      <Link to="/" className="logo-link"><div className="logo">NEONVERSE</div></Link>


      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        {timeLeft > 0 && <Link to="/feed">Feed</Link>}
        

        <a href="#" onClick={() => dispatch(changePath())}>{host}</a>
        {/* <Link to="/">User images</Link> */}
      </nav>


      <div className="header-right">
        <div className="user-avatar-wrapper">
          {!localStorage.getItem("neonverseUser") ? <div onClick={toggleUserMenu} className="user-avatar" >neo</div> :
            <img className="user-avatar" ref={avatarRef} onClick={toggleUserMenu} src={user.avatar_url} />}



          <div className="username">{username}</div>

          {userMenuOpen && (
            <div
              onClick={() => closeMenu()}
              className="user-dropdown"
              style={{ top: dropdownPos.top, right: dropdownPos.right }}
            >
              {timeLeft > 0 && <Link to="/profile">
                {/* Profile Icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                  <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
                Profile
              </Link>}

              <Link to="/">
                {/* Settings Icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                  <path d="M19.4 12.9c0-.3 0-.5-.1-.8l2.1-1.6-2-3.5-2.5 1c-.4-.3-.9-.6-1.4-.8L15 3h-6l-.5 2.2c-.5.2-1 .5-1.4.8l-2.5-1-2 3.5 2.1 1.6c0 .3-.1.5-.1.8s0 .5.1.8l-2.1 1.6 2 3.5 2.5-1c.4.3.9.6 1.4.8L9 21h6l.5-2.2c.5-.2 1-.5 1.4-.8l2.5 1 2-3.5-2.1-1.6c0-.3.1-.5.1-.8zM12 15.5c-1.9 0-3.5-1.6-3.5-3.5S10.1 8.5 12 8.5 15.5 10.1 15.5 12 13.9 15.5 12 15.5z" />
                </svg>
                Settings
              </Link>

              {timeLeft > 0 ?
                (
                  <a href="#" onClick={logout}>
                    {/* Logout Icon */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                      <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-9H8c-1.1 0-2 .9-2 2v4h2V6h11v12H8v-4H6v4c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                    </svg>
                    Logout in <br /> {formatTime(timeLeft)}
                  </a>
                )
                :
                (
                  <Link to="/login">
                    {/* Login Icon */}
                    <svg viewBox="0 0 24 24" fill="currentColor" className="dropdown-icon">
                      <path d="M10 17v-2h4v-2h-4v-2l-5 3 5 3zm9-13H5c-1.1 0-2 .9-2 2v4h2V6h14v12H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z" />
                    </svg>
                    Login/Register
                  </Link>
                )}


            </div>
          )}
        </div>

        <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="#0ff" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="#0ff" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </div>
      </div>
    </header>
  );
}