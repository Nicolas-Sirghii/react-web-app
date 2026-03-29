from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from credentials import mySqlConnection
import hashlib
import os

register = APIRouter()

@register.post("/register")
async def register_user(request: Request):
    data = await request.json()

    username = data['username']
    password = data['password']
    email = data['email']

    db = mySqlConnection()
    cursor = db.cursor()

    # ✅ check username OR email
    cursor.execute(
        "SELECT id FROM users WHERE username = %s OR email = %s",
        (username, email)
    )
    answer = cursor.fetchone()

    if answer:
        cursor.close()
        db.close()
        return JSONResponse(
            status_code=400,
            content={"detail": "Username or email already exists"}
        )

    # ✅ hash password
    salt = os.urandom(16).hex()
    hashed = hashlib.sha256((password + salt).encode()).hexdigest()

    # ✅ insert safely
    cursor.execute(
        "INSERT INTO users (username, password, salt, email) VALUES (%s, %s, %s, %s)",
        (username, hashed, salt, email)
    )

    db.commit()

    cursor.close()
    db.close()

    return {"message": f"Registered {username} successfully"}