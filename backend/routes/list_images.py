from fastapi import APIRouter
from credentials import awsS3Connection, awsBucketName

list_images_route = APIRouter()

s3 = awsS3Connection()
BUCKET = awsBucketName()

@list_images_route.get("/admin/list-images")
def list_images():
    try:
        response = s3.list_objects_v2(Bucket=BUCKET)
        files = []
        for obj in response.get("Contents", []):
            files.append({
                "key": obj["Key"],
                "url": f"https://{BUCKET}.s3.amazonaws.com/{obj['Key']}"
            })
        return {"files": files}
    except Exception as e:
        return {"files": [], "error": str(e)}
