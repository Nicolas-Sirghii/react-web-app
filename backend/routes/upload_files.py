from fastapi import APIRouter, File, UploadFile
from credentials import awsS3Connection, awsBucketName


s3 = awsS3Connection()
BUCKET = awsBucketName()

upload_route = APIRouter()

@upload_route.post("/admin/upload")
async def upload_image(file: UploadFile = File(...)):
    file_key = f"image/{file.filename}"

    s3.upload_fileobj(file.file, BUCKET, file_key)

    url = f"https://{BUCKET}.s3.amazonaws.com/{file_key}"

    return {"url": url}