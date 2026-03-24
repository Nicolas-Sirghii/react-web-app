import { Home } from "../Home/Home";
import "./Register.css"
import { Link } from "react-router-dom"

export function Register() {
    // const HOST = "http://127.0.0.1:8000"
      const HOST = "/api"

    async function createUser() {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch(`${HOST}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });
        const data1 = await response.json();

        alert(data1.status)
    }

    return (
        <div className="container">
            <h2>REGISTER</h2>
            <div className="glow-line"></div>
            <form>
                <input type="text" placeholder="Username" required id="username" />
                <input type="email" placeholder="Email" required id="email" />
                <input type="password" placeholder="Password" required />
                <input type="password" placeholder="Confirm Password" required id="password" />
                <button type="submit" onClick={createUser}>Create Account</button>
            </form>
            <div className="have-account-question">
                Already have an account? <Link to='/login'>Login</Link>
            </div>
            <div className="footer">Neon System v1.0</div>
        </div>
    )
}