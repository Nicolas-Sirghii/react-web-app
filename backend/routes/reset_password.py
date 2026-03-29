from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from credentials import mySqlConnection
import hashlib
import os
from datetime import datetime

reset_router = APIRouter()

@reset_router.post("/reset-password")
async def reset_password(request: Request):
    data = await request.json()
    email = data.get("email")
    code = data.get("code")
    new_password = data.get("newPassword")

    db = mySqlConnection()
    cursor = db.cursor()

    # Find user
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
        cursor.close()
        db.close()
        return JSONResponse(status_code=404, content={"detail": "Email not found"})

    user_id = user[0]

    # Verify code
    cursor.execute(
        "SELECT id, expires_at, used FROM password_resets WHERE user_id = %s AND code = %s",
        (user_id, code)
    )
    record = cursor.fetchone()
    if not record:
        cursor.close()
        db.close()
        return JSONResponse(status_code=400, content={"detail": "Invalid code"})

    reset_id, expires_at, used = record

    if used:
        cursor.close()
        db.close()
        return JSONResponse(status_code=400, content={"detail": "Code already used"})

    if datetime.utcnow() > expires_at:
        cursor.close()
        db.close()
        return JSONResponse(status_code=400, content={"detail": "Code expired"})

    # Hash new password
    salt = os.urandom(16).hex()
    hashed = hashlib.sha256((new_password + salt).encode()).hexdigest()

    # Update user password
    cursor.execute(
        "UPDATE users SET password = %s, salt = %s WHERE id = %s",
        (hashed, salt, user_id)
    )

    # Mark code as used
    cursor.execute("UPDATE password_resets SET used = TRUE WHERE id = %s", (reset_id,))

    db.commit()
    cursor.close()
    db.close()

    return {"message": "Password reset successfully"}