import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";


export function Header(username) {
    const [menuOpen, setMenuOpen] = useState(false);
    const re = useRef(null);
    useEffect(() => {
      re.current.innerText = localStorage.getItem("username") || "Login" ; 
    }, [username])
   
     const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("username")
    window.location.href = "/login";
  };
    return(
        
        
      
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
            <button>Profile</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
      
      
    )
}