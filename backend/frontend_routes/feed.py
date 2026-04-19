from fastapi import APIRouter, Request, UploadFile, File
import jwt
import uuid
from credentials import secret_key, sql_conn, aws_bucket_name, s3_aws


# ================= CONFIG =================
SECRET = secret_key()

BUCKET = aws_bucket_name()

s3 = s3_aws()

feedRouter = APIRouter()

# ================= HELPERS =================
def get_connection():
    return sql_conn()

def get_user_id(request: Request):
    auth = request.headers.get("Authorization")
    token = auth.split(" ")[1]
    payload = jwt.decode(token, SECRET, algorithms=["HS256"])
    return payload["user_id"]

# ================= POSTS =================

@feedRouter.post("/posts")
async def create_post(request: Request):
    body = await request.json()
    content = body.get("content")
    user_id = get_user_id(request)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO posts (user_id, content) VALUES (%s, %s)",
        (user_id, content)
    )

    conn.commit()
    post_id = cursor.lastrowid

    cursor.close()
    conn.close()

    return {"post_id": post_id}


# -------- GET POSTS (pagination + preload media) --------
@feedRouter.get("/posts")
def get_posts(request: Request, page: int = 1, limit: int = 10):
    user_id = get_user_id(request)
    offset = (page - 1) * limit

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT 
            p.id AS post_id,
            p.content,
            p.created_at,
            m.id AS media_id,
            m.type,
            m.url
        FROM posts p
        LEFT JOIN media m ON p.id = m.post_id
        WHERE p.user_id = %s
        ORDER BY p.created_at DESC
        LIMIT %s OFFSET %s
    """, (user_id, limit, offset))

    rows = cursor.fetchall()

    posts_map = {}

    for r in rows:
        pid = r["post_id"]

        if pid not in posts_map:
            posts_map[pid] = {
                "id": pid,
                "content": r["content"],
                "created_at": r["created_at"],
                "media": []
            }

        if r["media_id"]:
            posts_map[pid]["media"].append({
                "id": r["media_id"],
                "type": r["type"],
                "url": r["url"]
            })

    cursor.close()
    conn.close()

    return list(posts_map.values())


# -------- MEDIA UPLOAD --------
@feedRouter.post("/posts/{post_id}/media")
async def upload_media(post_id: int, request: Request, files: list[UploadFile] = File(...)):
    user_id = get_user_id(request)

    conn = get_connection()
    cursor = conn.cursor()

    for file in files:
        ext = file.filename.split(".")[-1]
        key = f"{user_id}/{uuid.uuid4()}.{ext}"

        s3.upload_fileobj(file.file, BUCKET, key)

        url = f"https://{BUCKET}.s3.amazonaws.com/{key}"
        media_type = "video" if file.content_type.startswith("video") else "image"

        cursor.execute(
            "INSERT INTO media (post_id, type, url) VALUES (%s, %s, %s)",
            (post_id, media_type, url)
        )

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "uploaded"}


# -------- EDIT POST --------
@feedRouter.put("/posts/{post_id}")
async def edit_post(post_id: int, request: Request):
    user_id = get_user_id(request)
    body = await request.json()

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE posts
        SET content = %s
        WHERE id = %s AND user_id = %s
    """, (body.get("content"), post_id, user_id))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "updated"}


# -------- DELETE POST --------
@feedRouter.delete("/posts/{post_id}")
def delete_post(post_id: int, request: Request):
    user_id = get_user_id(request)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM posts
        WHERE id = %s AND user_id = %s
    """, (post_id, user_id))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "deleted"}


# ================= COMMENTS =================

@feedRouter.post("/posts/{post_id}/comments")
async def add_comment(post_id: int, request: Request):
    body = await request.json()
    user_id = get_user_id(request)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO comments (post_id, user_id, content)
        VALUES (%s, %s, %s)
    """, (post_id, user_id, body.get("content")))

    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "comment added"}


@feedRouter.get("/posts/{post_id}/comments")
def get_comments(post_id: int, request: Request):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT * FROM comments
        WHERE post_id = %s
        ORDER BY created_at DESC
    """, (post_id,))

    data = cursor.fetchall()

    cursor.close()
    conn.close()

    return data