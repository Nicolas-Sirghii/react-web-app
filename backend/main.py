from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from frontend_routes.user_auth import user_auth_router
from frontend_routes.user_information import update_user_data
from frontend_routes.feed import feedRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_auth_router)
app.include_router(update_user_data)
app.include_router(feedRouter)


