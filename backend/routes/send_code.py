from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from credentials import mySqlConnection
import random
from datetime import datetime, timedelta
import os
import smtplib
from email.message import EmailMessage

send_code_router = APIRouter()

# Helper function to send email
def send_email(to_email: str, code: str):
    EMAIL_ADDRESS = "nicolas.mailbox100@gmail.com"
    EMAIL_PASSWORD = "hlsr hwer rspo jitk"

    msg = EmailMessage()
    msg.set_content(f"Your password recovery code is: {code}")
    msg['Subject'] = 'Password Recovery'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

@send_code_router.post("/send-code")
async def send_code(request: Request):
    data = await request.json()
    email = data.get("email")

    db = mySqlConnection()
    cursor = db.cursor()

    # Check if user exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
        cursor.close()
        db.close()
        return JSONResponse(status_code=404, content={"detail": "Email not found"})

    user_id = user[0]

    # Generate 6-digit code
    code = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=15)

    # Store code in DB
    cursor.execute(
        "INSERT INTO password_resets (user_id, code, expires_at) VALUES (%s, %s, %s)",
        (user_id, code, expires_at)
    )
    db.commit()

    cursor.close()
    db.close()

    # Send the recovery code via email
    try:
        send_email(email, code)
    except Exception as e:
        print("Failed to send email:", e)
        return JSONResponse(status_code=500, content={"detail": "Failed to send email"})

    return {"message": "Recovery code sent"}