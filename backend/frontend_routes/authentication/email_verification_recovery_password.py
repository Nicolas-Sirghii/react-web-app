# user_endpoints.py
from fastapi import APIRouter, HTTPException, Form, Header
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
import smtplib
from email.message import EmailMessage
import hashlib
import secrets
from credentials import mySqlConnection, working_url, secret_key, email_address, email_password

# ===== Config =====
SECRET_KEY = secret_key()
JWT_ALGORITHM = "HS256"

user_router = APIRouter()


# ===== Schemas =====
class TokenData(BaseModel):
    token: str


class EmailRequest(BaseModel):
    email: str


class UserIdRequest(BaseModel):
    user_id: str


# ===== Helpers =====
def create_token(email: str, expire_hours: int = 24) -> str:
    """Create JWT token for given email with expiration in hours."""
    expire = datetime.utcnow() + timedelta(hours=expire_hours)
    payload = {"email": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_token(token: str):
    """Verify JWT token and return email, raises HTTPException if invalid."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload["email"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")


def send_email(to_email: str, subject: str, body: str):
    """Send an email via SMTP."""
    EMAIL_USER = email_address()
    EMAIL_PASS = email_password()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = to_email
    msg.set_content(body)

    # Use SSL for Gmail
    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_USER, EMAIL_PASS)
        smtp.send_message(msg)

# ===== Endpoints =====

@user_router.post("/send-verification-email")
def send_verification_email(authorization: str = Header(...)):
    """
    Send email verification link.
    Expects login token in Authorization header: 'Bearer <login_token>'
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    token = authorization.split(" ")[1]

    # Decode login token
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload["user_id"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Login token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid login token")

    # Fetch user email from DB
    conn = mySqlConnection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT email FROM users WHERE id=%s", (user_id,))
        result = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    if not result:
        raise HTTPException(status_code=400, detail="User not found")

    email = result[0]

    # Create verification token and send email
    verification_token = create_token(email, expire_hours=24)
    link = f"{working_url()}/verify-email?token={verification_token}"
    send_email(email, "Verify your email", f"Click to verify your email: {link}")

    return {"message": f"Verification link sent to {email}"}

@user_router.post("/verify-email")
def verify_email(data: TokenData):
    """Verify email using token."""
    email = verify_token(data.token)

    conn = mySqlConnection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE users SET is_verified=1 WHERE email=%s", (email,))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return {"message": "Email verified!"}

@user_router.post("/forgot-password")
def forgot_password(email: str = Form(...)):
    """Send password recovery link to email."""
    conn = mySqlConnection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
        user = cursor.fetchone()
    finally:
        cursor.close()
        conn.close()

    if not user:
        return JSONResponse({"success": False, "message": "Email not found in system"})

    token = create_token(email, expire_hours=1)
    link = f"{working_url()}/recover-password?token={token}"
    send_email(email, "Password Recovery", f"Click the link to reset your password:\n{link}")

    return {"success": True, "message": "Recovery link sent"}


@user_router.post("/recover-password")
def recover_password(token: str = Form(...), password: str = Form(...)):
    """Recover password using token and new password."""
    email = verify_token(token)

    # Generate new salt and hash password
    salt = secrets.token_hex(16)
    hashed_password = hashlib.sha256((password + salt).encode()).hexdigest()

    conn = mySqlConnection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE users SET password=%s, salt=%s WHERE email=%s",
            (hashed_password, salt, email),
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()

    return {"success": True, "message": "Password updated successfully"}