from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from frontend_routes.authentication.register import register
from frontend_routes.authentication.login import login
from frontend_routes.authentication.send_recovery_code import send_code_router
from frontend_routes.authentication.reset_password import reset_router
from frontend_routes.list_user_images import list_route


from routes.get_message import message
from admin_routes.upload_files import upload_route
from routes.update_message import update_message_route
from routes.delete_file import delete_file_route
from routes.list_images import list_images_route
from routes.all_images import all_images_route
from frontend_routes.authentication.email_verification import sendCode
from frontend_routes.authentication.email_verification import verifyEmail
from frontend_routes.upload_avatar import avatar
from frontend_routes.get_ueser_data import user_data




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(register)
app.include_router(login)
app.include_router(message)
app.include_router(upload_route)
app.include_router(update_message_route)
app.include_router(delete_file_route)
app.include_router(list_images_route)
app.include_router(all_images_route)
app.include_router(send_code_router)
app.include_router(reset_router)
app.include_router(list_route)
app.include_router(verifyEmail)
app.include_router(sendCode)
app.include_router(avatar)

app.include_router(user_data)

