from fastapi import APIRouter, Query
from credentials import mySqlConnection

list_route = APIRouter()

@list_route.get("/a/list-images")
def list_images(user_id: int = Query(...)):
    """
    Returns all files uploaded by a specific user.
    """
    try:
        conn = mySqlConnection()
        cursor = conn.cursor()
        query = "SELECT url FROM files WHERE user_id = %s"
        cursor.execute(query, (user_id,))
        results = cursor.fetchall()
        cursor.close()
        conn.close()

        # results = list of tuples, extract urls
        urls = [row[0] for row in results]

        return {"user_id": user_id, "urls": urls}

    except Exception as e:
        return {"error": "Failed to fetch images", "details": str(e)}