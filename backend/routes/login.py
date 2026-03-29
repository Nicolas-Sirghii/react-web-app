from fastapi import APIRouter, Request
from credentials import mySqlConnection
from datetime import datetime, timedelta, UTC
import hashlib
import jwt


login = APIRouter()
SECRET_KEY = "superSecret8f39a4f8e2b0d45c8c2d8d8f2a8e7a1f"

@login.post("/login")
async def loginUser(request: Request):
    data = await request.json()
    email = data['email']
    password = data['password']

    db = mySqlConnection()
    cursor = db.cursor()

    cursor.execute(
        "SELECT password, salt, id, username FROM users WHERE email = %s",
        (email,)
    )

    answer = cursor.fetchone()
    print(answer)
    if answer:
        stored_password, salt, user_id, username = answer

        hashed = hashlib.sha256((password + salt).encode()).hexdigest()

        if hashed == stored_password:
            payload = {
                "user_id": user_id,   # ✅ FIXED
                "exp": datetime.now(UTC) + timedelta(minutes=30)
            }

            token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

            return {"token": token, "username": username}

    return {"token": "Invalid Credentials"}



