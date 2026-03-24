from fastapi import APIRouter
from credentials import awsS3Connection, awsBucketName

message = APIRouter()

@message.get("/message")
async def get_message():
    connection = mySqlConnection()
    cursor = connection.cursor()
    cursor.execute("SELECT text FROM messages where id=1;")
    result = cursor.fetchone()
    cursor.close()
    connection.close()

    return {
        "text": result[0] if result else "",
    }



