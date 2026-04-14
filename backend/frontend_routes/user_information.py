from fastapi import  APIRouter, UploadFile, File, Form, HTTPException, Header
import uuid
from typing import Optional
import jwt

from credentials import sql_conn, s3_aws, secret_key, aws_bucket_name



update_user_data = APIRouter()




SECRET_KEY = secret_key()

def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

BUCKET_NAME = aws_bucket_name()
s3 = s3_aws()



@update_user_data.post("/update-profile")
async def update_profile(
    username: str = Form(...),
    email: str = Form(...),
    age: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    gender: Optional[str] = Form(None),
    bio: Optional[str] = Form(None),
    avatar: Optional[UploadFile] = File(None),
    authorization: str = Header(None)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]
    user_id = get_current_user(token)

    avatar_url = None

    # 📤 Upload to S3 if image exists
    if avatar:
        file_extension = avatar.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"

        s3.upload_fileobj(
            avatar.file,
            BUCKET_NAME,
            filename,
            ExtraArgs={"ContentType": avatar.content_type}
        )

        avatar_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"

    # 🗄 Update database
    db = sql_conn()
    cursor = db.cursor()

    if avatar_url:
        query = """
        UPDATE users 
        SET username=%s, email=%s, age=%s, phone=%s, gender=%s, bio=%s, avatar_url=%s
        WHERE id=%s
        """
        values = (username, email, age, phone, gender, bio, avatar_url, user_id)
    else:
        query = """
        UPDATE users 
        SET username=%s, email=%s, age=%s, phone=%s, gender=%s, bio=%s
        WHERE id=%s
        """
        values = (username, email, age, phone, gender, bio, user_id)

    cursor.execute(query, values)
    db.commit()

    # ✅ commit update
    db.commit()

    # ✅ fetch updated user
    cursor.execute("""
        SELECT id, username, email, is_verified, avatar_url, age, phone, gender, bio
        FROM users
        WHERE id=%s
    """, (user_id,))

    updated_user = cursor.fetchone()

    cursor.close()
    db.close()

    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found after update")

    (
        user_id,
        username,
        email,
        is_verified,
        avatar_url,
        age,
        phone,
        gender,
        bio
    ) = updated_user

    return {
        "message": "Profile updated",
        "user_data": {
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

