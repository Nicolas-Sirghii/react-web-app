import "../Register/Register.css"
import { Link } from "react-router-dom"

export function Login() {
    return (
        <div className="container">
            <h2>LOGIN</h2>
            <div className="glow-line"></div>
            <form>
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <Link to='/'><button type="submit">Access System</button></Link>
            </form>
            <div className="have-account-question">
                Don't have an account? <Link to="/register">Register</Link>
            </div>
            <div className="footer">Neon System v1.0</div>
        </div>
    )
}