from fastapi import APIRouter, File, UploadFile, Form
import os

from credentials import awsS3Connection, awsBucketName, mySqlConnection

s3 = awsS3Connection()
BUCKET = awsBucketName()

upload_route = APIRouter()


@upload_route.post("/admin/upload")
async def upload_image(
    user_id: int = Form(...),
    file: UploadFile = File(...)
):
    # Create unique filename for S3
    file_extension = os.path.splitext(file.filename)[1]
    unique_name = f"{os.urandom(8).hex()}{file_extension}"
    file_key = f"images/{unique_name}"

    # Upload to S3
    try:
        s3.upload_fileobj(file.file, BUCKET, file_key)
    except Exception as e:
        return {"error": "Failed to upload to S3", "details": str(e)}

    url = f"https://{BUCKET}.s3.amazonaws.com/{file_key}"

    # Save info to MySQL
    try:
        conn = mySqlConnection()
        cursor = conn.cursor()
        query = """
            INSERT INTO files (user_id, filename, s3_key, url)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (user_id, file.filename, file_key, url))
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        return {"error": "Failed to save file info to database", "details": str(e)}

    return {"url": url, "user_id": user_id}