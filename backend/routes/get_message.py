from fastapi import APIRouter, Depends, HTTPException
from credentials import mySqlConnection
from datetime import datetime
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt


message = APIRouter()

SECRET_KEY = "superSecret8f39a4f8e2b0d45c8c2d8d8f2a8e7a1f"

security = HTTPBearer()
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        exp = payload.get("exp")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        if datetime.utcnow().timestamp() > exp:
            raise HTTPException(status_code=401, detail="Token expired")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")



@message.get("/message")
async def get_message(current_user: int = Depends(get_current_user)):

    print(current_user)

    connection = mySqlConnection()
    cursor = connection.cursor()
    cursor.execute("SELECT text FROM messages where id=1;")
    result = cursor.fetchone()
    cursor.close()
    connection.close()

    return {"message": f"Hello user {current_user}, you are authenticated!", "text": result[0], "user_id": current_user}



