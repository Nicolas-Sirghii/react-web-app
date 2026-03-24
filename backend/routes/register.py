from fastapi import APIRouter

register = APIRouter()

@register.post("/register")
async def registerUser():
    return {"hello": "You are registered"}