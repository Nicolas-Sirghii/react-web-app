# main.py
from fastapi import FastAPI, APIRouter, HTTPException, Form
from fastapi.responses import JSONResponse
from credentials import mySqlConnection, secret_key, working_url, email_address, email_password  # your DB connection function
import jwt
from datetime import datetime, timedelta
import smtplib
from email.message import EmailMessage
import hashlib
import secrets


SECRET_KEY = secret_key()  # change this to a strong secret
JWT_ALGORITHM = "HS256"

app = FastAPI()
forgotPassword = APIRouter()
recoverPassword = APIRouter()




def send_email(to_email: str, link: str):
    EMAIL_ADDRESS = email_address()  # SMTP email
    EMAIL_PASSWORD = email_password()

    msg = EmailMessage()
    msg['Subject'] = 'Password Recovery'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email
    msg.set_content(f"Click the link to reset your password:\n{link}")

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

def generate_token(email: str):
    expiration = datetime.utcnow() + timedelta(hours=1)
    payload = {"email": email, "exp": expiration}
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload['email']
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")

# --- Routes ---
@forgotPassword.post("/forgot-password")
async def forgot_password(email: str = Form(...)):
    conn = mySqlConnection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        return JSONResponse({"success": False, "message": "Email not found in system"})

    token = generate_token(email)
    link = f"{working_url()}/recover-password?token={token}"  # frontend link
    send_email(email, link)

    return {"success": True, "message": "Recovery link sent"}

@recoverPassword.post("/recover-password")
async def recover_password(token: str = Form(...), password: str = Form(...)):
    if not token:
        raise HTTPException(status_code=400, detail="Token is required")
    email = verify_token(token)

    # generate new salt
    salt = secrets.token_hex(16)

    # hash password the SAME way as login
    hashed_password = hashlib.sha256((password + salt).encode()).hexdigest()

    conn = mySqlConnection()
    cursor = conn.cursor()

    cursor.execute(
        "UPDATE users SET password=%s, salt=%s WHERE email=%s",
        (hashed_password, salt, email)
    )

    conn.commit()
    cursor.close()
    conn.close()

    return {"success": True, "message": "Password updated successfully"}