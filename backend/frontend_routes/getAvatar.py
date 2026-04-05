from fastapi import  APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from credentials import mySqlConnection, secret_key

getAvatarImage = APIRouter()
security = HTTPBearer()
SECRET_KEY = secret_key()  # your JWT secret

# ---------------- JWT helper ----------------
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload  # must contain user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ---------------- Endpoint ----------------
@getAvatarImage.get("/get-avatar")
async def get_avatar(user_id: str = None, user=Depends(get_current_user)):
    """
    Returns the avatar URL of the user.
    If user_id is provided in query params, uses that.
    Otherwise, defaults to user_id from JWT.
    """
    uid = user_id or user.get("user_id")
    if not uid:
        raise HTTPException(status_code=400, detail="User ID not provided")

    db = mySqlConnection()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT avatar_url FROM users WHERE id = %s", (uid,))
    row = cursor.fetchone()

    cursor.close()
    db.close()

    if not row or not row.get("avatar_url"):
        return {"avatar_url": None}

    return {"avatar_url": row["avatar_url"]}