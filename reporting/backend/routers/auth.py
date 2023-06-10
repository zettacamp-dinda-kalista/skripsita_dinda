from dotenv import dotenv_values
from fastapi import APIRouter, Body, Request, Response, HTTPException
from os import getenv
from jwt import encode as jwt_encode, decode as jwt_decode
from utils.hash import Hash
from models.auth import AuthLoginRequest

router = APIRouter(prefix = "/auth")

########################## Login
@router.post("/login", response_description = "Login")
def login(request: Request, body: AuthLoginRequest = Body(...)):
    user = request.app.database["users"].find_one(
        { "email" : body.email }
    )

    if user is None or not Hash.verify(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # delete sensitive user data before returned to client
    del user["password"]
    # del user["role"]
    # del user["permission"]

    # convert ObjectId to string
    user["_id"] = str(user["_id"])

    return {
        "user": user,
        "token": jwt_encode(
            {
                "exp": 2592000000,
                "_id": str(user["_id"])
            }, 
            getenv("JWT_SECRET"), 
            getenv("JWT_ALGORITHM")
        )
    }
