from fastapi import FastAPI, APIRouter, HTTPException
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta
import smtplib
from email.mime.text import MIMEText
from credentials import mySqlConnection, working_url

# ===== Config =====
SECRET_KEY = "superSecret8f39a4f8e2b0d45c8c2d8d8f2a8e7a1f"
EMAIL_USER = "nicolas.mailbox100@gmail.com"
EMAIL_PASS = "hlsr hwer rspo jitk"

verifyEmail = APIRouter()
sendCode = APIRouter()

# ===== Helpers =====
def create_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(hours=24)
    return jwt.encode({"email": email, "exp": expire}, SECRET_KEY, algorithm="HS256")

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("email")
    except:
        return None

def send_email(to_email: str, token: str):
    link = f"{working_url()}/verify-email?token={token}"
    msg = MIMEText(f"Click to verify your email: {link}")
    msg["Subject"] = "Verify your email"
    msg["From"] = EMAIL_USER
    msg["To"] = to_email
    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)

# ===== Schemas =====
class TokenData(BaseModel):
    token: str

class EmailRequest(BaseModel):
    email: str

# ===== Endpoints =====
@verifyEmail.post("/verify-email")
def verify_email(data: TokenData):
    email = verify_token(data.token)
    if not email:
        raise HTTPException(400, "Invalid or expired token")

    conn = mySqlConnection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET is_verified=1 WHERE email=%s", (email,))
    conn.commit()
    conn.close()

    return {"message": "Email verified!"}

class UserIdRequest(BaseModel):
    user_id: str

@sendCode.post("/send-verification-email")
def send_verification_email_by_id(req: UserIdRequest):
    conn = mySqlConnection()
    cursor = conn.cursor()
    cursor.execute("SELECT email FROM users WHERE id=%s", (req.user_id,))
    result = cursor.fetchone()
    conn.close()
    if not result:
        raise HTTPException(400, "User not found")

    email = result[0]
    token = create_token(email)
    send_email(email, token)
    return {"message": f"Verification link sent to {email}"}