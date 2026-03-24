from fastapi import APIRouter, HTTPException
from credentials import awsS3Connection, awsBucketName



delete_file_route = APIRouter()

BUCKET = awsBucketName()
s3 = awsS3Connection()

@delete_file_route.delete("/admin/delete")
def delete_file(filename: str):
    try:
        # Remove spaces from filename (if needed)
        key = filename.replace(" ", "_")
        s3.delete_object(Bucket=BUCKET, Key=key)
        return {"status": "deleted"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
