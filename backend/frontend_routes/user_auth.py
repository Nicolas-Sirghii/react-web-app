from fastapi import APIRouter, HTTPException, Form, Header, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
import jwt
import smtplib
from email.message import EmailMessage
import hashlib
import os

from credentials import sql_conn, working_url, secret_key, email_address, email_password

# ===== Config =====
SECRET_KEY = secret_key()
JWT_ALGORITHM = "HS256"
user_auth_router = APIRouter()


# ===== Schemas =====
class TokenData(BaseModel):
    token: str


# ===== Helpers =====
def hash_password(password: str, salt: str) -> str:
    return hashlib.sha256((password + salt).encode()).hexdigest()


def create_salt() -> str:
    return os.urandom(16).hex()


def create_token(payload: dict, expire_minutes: int = 30) -> str:
    payload["exp"] = int((datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)).timestamp())
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def create_email_token(email: str, expire_hours: int = 24) -> str:
    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=expire_hours)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)


def verify_email_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload["email"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=400, detail="Invalid token")


def send_email(to_email: str, subject: str, body: str):
    EMAIL_USER = email_address()
    EMAIL_PASS = email_password()

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login(EMAIL_USER, EMAIL_PASS)
        smtp.send_message(msg)


# ===== AUTH ENDPOINTS =====

@user_auth_router.post("np")
async def register_user(request: Request):
    data = await request.json()

    username = data['username']
    password = data['password']
    email = data['email']

    db = sql_conn()
    cursor = db.cursor()

    cursor.execute(
        "SELECT id FROM users WHERE username=%s OR email=%s",
        (username, email)
    )
    if cursor.fetchone():
        cursor.close()
        db.close()
        return JSONResponse(
            status_code=400,
            content={"detail": "Username or email already exists"}
        )

    salt = create_salt()
    hashed = hash_password(password, salt)

    cursor.execute(
        "INSERT INTO users (username, password, salt, email) VALUES (%s, %s, %s, %s)",
        (username, hashed, salt, email)
    )
    db.commit()

    cursor.close()
    db.close()

    return {"message": f"Registered {username} successfully"}


@user_auth_router.post("/login")
async def login_user(request: Request):
    data = await request.json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")

    db = sql_conn()
    cursor = db.cursor()

    cursor.execute(
        """
        SELECT password, salt, id, username, email, is_verified, avatar_url, age, phone, gender, bio
        FROM users
        WHERE email=%s
        """,
        (email,)
    )

    user = cursor.fetchone()

    if not user:
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
    ) = user

    if hash_password(password, salt) != stored_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"user_id": user_id})

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


# ===== EMAIL VERIFICATION =====

@user_auth_router.post("/send-verification-email")
def send_verification_email(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id = payload["user_id"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Login token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid login token")

    db = sql_conn()
    cursor = db.cursor()

    cursor.execute("SELECT email FROM users WHERE id=%s", (user_id,))
    result = cursor.fetchone()

    cursor.close()
    db.close()

    if not result:
        raise HTTPException(status_code=400, detail="User not found")

    email = result[0]

    verification_token = create_email_token(email)
    link = f"{working_url()}/verify-email?token={verification_token}"

    send_email(email, "Verify your email", f"Click to verify your email: {link}")

    return {"message": f"Verification link sent to {email}"}


@user_auth_router.post("/verify-email")
def verify_email(data: TokenData):
    email = verify_email_token(data.token)

    db = sql_conn()
    cursor = db.cursor()

    cursor.execute("UPDATE users SET is_verified=1 WHERE email=%s", (email,))
    db.commit()

    cursor.close()
    db.close()

    return {"message": "Email verified!"}


# ===== PASSWORD RESET =====

@user_auth_router.post("/forgot-password")
def forgot_password(email: str = Form(...)):
    db = sql_conn()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    cursor.close()
    db.close()

    if not user:
        return JSONResponse({"success": False, "message": "Email not found in system"})

    token = create_email_token(email, expire_hours=1)
    link = f"{working_url()}/recover-password?token={token}"

    send_email(email, "Password Recovery", f"Click to reset your password:\n{link}")

    return {"success": True, "message": "Recovery link sent"}

@user_auth_router.post("/recover-password")
def recover_password(
    token: str = Form(...),
    password: str = Form(...)
):
    if not token or not password:
        raise HTTPException(status_code=400, detail="Token and password are required")

    # verify token → get email
    email = verify_email_token(token)

    db = sql_conn()
    cursor = db.cursor()

    # create new salt + hash password
    salt = create_salt()
    hashed = hash_password(password, salt)

    cursor.execute(
        "UPDATE users SET password=%s, salt=%s WHERE email=%s",
        (hashed, salt, email)
    )
    db.commit()

    cursor.close()
    db.close()

    return {"message": "Password updated successfully"}

@user_auth_router.get("/is-authorized")
def is_authorized(authorization: str = Header(None)):
    """
    Check if the user token is valid.
    Returns "1" if valid, "0" if invalid or missing.
    Expects: Authorization header = 'Bearer <token>'
    """
    if not authorization or not authorization.startswith("Bearer "):
        return {"answer":"0"}

    token = authorization.split(" ")[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        # Optional: you could check user exists in DB if you want extra validation
        return {"answer":"1"}
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return {"answer":"0"}