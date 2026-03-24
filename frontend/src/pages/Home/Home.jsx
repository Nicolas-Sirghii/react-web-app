import "./Home.css"
import { Link } from "react-router-dom";
import { useEffect } from "react";

export function Home() {

    function toggleDropdown() {
      const dropdown = document.getElementById('dropdown');
      dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
   
    function dropDown () {
        
        const dropdown = document.getElementById('dropdown');
        if (dropdown.style.display === 'block') {
          dropdown.style.display = 'none';
        }
      
    }



    //............................................................

// const HOST = "http://127.0.0.1:8000"
  const HOST = "/api"

  async function loadContent() {
    // Get message
    const msgRes = await fetch(`${HOST}/message`);
    const msgData = await msgRes.json();
    document.getElementById("username").innerText = msgData.text;

    // Get all images
    const imgRes = await fetch(`${HOST}/all-images`);
    const imgData = await imgRes.json();
    const imagesDiv = document.getElementById("images");
    imagesDiv.innerHTML = "";

    if (imgData.files && imgData.files.length > 0) {
        imgData.files.forEach(file => {
            const img = document.createElement("img");
            img.src = file.url;
            img.alt = file.key;
            imagesDiv.appendChild(img);
        });
    } else {
        imagesDiv.innerHTML = "<p>No images found</p>";
    }
}
useEffect(() => {
async function contentLoader() {
  await loadContent();
}
contentLoader();
}, [])


    return (
        <>
            <div className="header">
                <div className="logo">NEON TIME</div>
                <div className="user-menu" onClick={toggleDropdown}>
                    <img src="/logo.png" alt="User" onClick={dropDown} />
                        <div className="username" id="username">JohnDoe</div>
                        <div className="dropdown" id="dropdown">
                            <a href="#">Profile</a>
                            <a href="#">Settings</a>
                            <a href="#">Logout</a>
                            <Link to="/login">Login</Link>
                        </div>
                </div>
            </div>

            <div className="home-container">


                <div className="panel">
                    <h3>Add Task</h3>
                    <div className="glow-line"></div>
                    <input type="text" placeholder="Task name" />
                    <input type="time" />
                    <button>Add Task</button>
                </div>

                <div className="panel">
                    <h3>Your Tasks</h3>
                    <div className="glow-line"></div>

                    <div className="task">
                        Gym Workout
                        <span>07:00 AM</span>
                    </div>

                    <div className="task">
                        Study English
                        <span>09:00 PM</span>
                    </div>

                </div>
                <div id="images"></div>
            </div>
        </>
    )
}