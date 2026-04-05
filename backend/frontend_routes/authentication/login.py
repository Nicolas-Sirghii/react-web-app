from fastapi import APIRouter, Request, HTTPException
from credentials import mySqlConnection
from datetime import datetime, timedelta, timezone
import hashlib
import jwt

login = APIRouter()
SECRET_KEY = "superSecret8f39a4f8e2b0d45c8c2d8d8f2a8e7a1f"

@login.post("/login")
async def loginUser(request: Request):
    data = await request.json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    db = mySqlConnection()
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT password, salt, id, username, email, is_verified, avatar_url, age, phone, gender, bio
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    answer = cursor.fetchone()

    if not answer:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    (
        stored_password,
        salt,
        user_id,
        username,
        email,
        is_verified,
        avatar_url,
        age,
        phone,
        gender,
        bio
    ) = answer

    hashed = hashlib.sha256((password + salt).encode()).hexdigest()

    if hashed != stored_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    payload = {
        "user_id": user_id,
        "exp": int((datetime.now(timezone.utc) + timedelta(minutes=30)).timestamp())
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")

    return {
        "token": token,
        "user": {
            "id": user_id,
            "username": username,
            "email": email,
            "is_verified": is_verified,
            "avatar_url": avatar_url,
            "age": age,
            "phone": phone,
            "gender": gender,
            "bio": bio
        }
    }


