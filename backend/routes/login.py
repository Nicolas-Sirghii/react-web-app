from fastapi import APIRouter

login = APIRouter()

@login.get("/login")
async def userLogin():
    return {"hello": "You are Logged In"}