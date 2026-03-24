from fastapi import APIRouter
from credentials import mySqlConnection
from pydantic import BaseModel
from mysql.connector import Error

update_message_route = APIRouter()

class MessageUpdate(BaseModel):
    text: str

@update_message_route.post("/update-message")
def update_message(data: MessageUpdate):
    try:
        connection = mySqlConnection()
        cursor = connection.cursor()
        cursor.execute(
            "UPDATE messages SET text=%s WHERE id=1;",
            (data.text,)  # <-- wrap in tuple
        )
        connection.commit()
        return {"status": "updated"}
    except Error as e:
        return {"error": str(e)}
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

