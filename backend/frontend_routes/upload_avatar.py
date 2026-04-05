
import uuid
import jwt
from fastapi import FastAPI, APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from credentials import awsBucketName, awsS3Connection, mySqlConnection

app = FastAPI()
avatar = APIRouter()
security = HTTPBearer()

# ================= AWS =================
s3 = awsS3Connection()
BUCKET_NAME = awsBucketName()
SECRET_KEY = "superSecret8f39a4f8e2b0d45c8c2d8d8f2a8e7a1f"
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload  # must contain user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ================= VALIDATION =================
ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]

def validate_file(file: UploadFile):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Invalid file type")

# ================= ENDPOINT =================
@avatar.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user_id: int = File(...)
):
    try:
        validate_file(file)

        # Generate filename
        ext = file.filename.rsplit(".", 1)[-1]
        filename = f"avatars/{uuid.uuid4()}.{ext}"

        # Upload to S3
        s3.upload_fileobj(
            file.file,
            BUCKET_NAME,
            filename,
            ExtraArgs={"ContentType": file.content_type}
        )

        file_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"

        # Save to DB
        db = mySqlConnection()
        cursor = db.cursor()

        cursor.execute(
            "UPDATE users SET avatar_url = %s WHERE id = %s",
            (file_url, user_id)
        )

        db.commit()
        cursor.close()
        db.close()

        return {
            "message": "Avatar uploaded",
            "avatar_url": file_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))