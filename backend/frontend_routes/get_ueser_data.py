from fastapi import APIRouter, Request, HTTPException
import mysql.connector
import jwt
from credentials import mySqlConnection, secret_key


SECRET_KEY = secret_key()  # change this
user_data = APIRouter()

def get_user_id_from_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found in token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_user_from_db(user_id):
    try:
        conn = mySqlConnection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT username, email, is_verified, avatar_url, age, phone, gender, bio FROM users WHERE id = %s"
        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except mysql.connector.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")


# -----------------------
# ENDPOINT
# -----------------------
@user_data.get("/profile")
async def get_profile(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Expect header format: "Bearer <token>"
    try:
        token = auth_header.split(" ")[1]
    except IndexError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    user_id = get_user_id_from_token(token)
    user = get_user_from_db(user_id)

    return user