from fastapi import APIRouter, Depends
from credentials import mySqlConnection
from credentials import get_current_user

message = APIRouter()

@message.get("/message")
async def get_message(current_user: int = Depends(get_current_user)):

    print(current_user)

    connection = mySqlConnection()
    cursor = connection.cursor()
    cursor.execute("SELECT text FROM messages where id=1;")
    result = cursor.fetchone()
    cursor.close()
    connection.close()

    return {"message": f"Hello user {current_user}, you are authenticated!", "text": result[0]}



